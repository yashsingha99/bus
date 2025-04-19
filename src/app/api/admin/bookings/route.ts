import { NextResponse } from "next/server";
import { dbConnection } from "@/lib/db";
import { BookingModel } from "@/model/booking.model";
// import { Types } from "mongoose";

// interface QueryParams {
//   page?: string;
//   limit?: string;
//   status?: string;
//   search?: string;
// }

export async function GET(request: Request) {
  try {
    await dbConnection();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const paymentStatus = searchParams.get("status"); // Changed from status to paymentStatus
    const search = searchParams.get("search");
    
    const query: Record<string, unknown> = {};
    
    if (paymentStatus) {
      query.paymentStatus = paymentStatus; // Use paymentStatus field instead of status
    }
    
    if (search) {
      query.$or = [
        { pickupAddress: { $regex: search, $options: "i" } },
        { dropoffAddress: { $regex: search, $options: "i" } },
        { "bookedBy.fullName": { $regex: search, $options: "i" } }, // Match the component's data structure
        { "bookedBy.email": { $regex: search, $options: "i" } },
        { "bookedBy.phone": { $regex: search, $options: "i" } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    // Updated to match the populated fields used in the frontend
    const bookings = await BookingModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("bookedBy", "fullName email phone role")
      .populate("destination");
    
    const totalBookings = await BookingModel.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      data: bookings,
      pagination: {
        total: totalBookings,
        page,
        limit,
        totalPages: Math.ceil(totalBookings / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// Create a new booking (admin)
export async function POST(request: Request) {
  await dbConnection();
  
  try {
    const bookingData = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'pickupAddress', 
      'bookedBy', 
      'destination', 
      'time', 
      'passengerDetails',
      'totalAmount'
    ];
    
    const missingFields = requiredFields.filter(field => !bookingData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, message: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Validate passenger details
    if (!bookingData.passengerDetails || bookingData.passengerDetails.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one passenger is required" },
        { status: 400 }
      );
    }
    
    // Create the booking
    const newBooking = await BookingModel.create({
      ...bookingData,
      status: "confirmed",
      paymentStatus: "completed"
    });
    
    return NextResponse.json({
      success: true,
      message: "Booking created successfully",
      data: newBooking
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create booking" },
      { status: 500 }
    );
  }
} 
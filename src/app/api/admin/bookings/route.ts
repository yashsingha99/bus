import { dbConnection } from "@/lib/db";
import { BookingModel } from "@/model/booking.model";
import { NextRequest, NextResponse } from "next/server";

// Get all bookings with pagination
export async function GET(request: NextRequest) {
  await dbConnection();
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const paymentStatus = searchParams.get("paymentStatus") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";
    
    const skip = (page - 1) * limit;
    
    // Build query
    const query: any = {};
    
    if (search) {
      query.$or = [
        { pickupAddress: { $regex: search, $options: "i" } }
      ];
    }
    
    if (status) {
      query.status = status;
    }
    
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }
    
    if (startDate && endDate) {
      query.time = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    // Get bookings with pagination
    const bookings = await BookingModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('bookedBy', 'fullName email phoneNumber')
      .populate('trip', 'busNumber departureTime arrivalTime')
      .populate('destination', 'name');
    
    // Get total count for pagination
    const total = await BookingModel.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      data: {
        bookings,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch bookings", error: error.message },
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
      'trip', 
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
      paymentStatus: "paid"
    });
    
    return NextResponse.json({
      success: true,
      message: "Booking created successfully",
      data: newBooking
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create booking", error: error.message },
      { status: 500 }
    );
  }
} 
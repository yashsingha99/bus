import { dbConnection } from "@/lib/db";
import { BookingModel } from "@/model/booking.model";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

// Get all refunds with pagination
export async function GET(request: NextRequest) {
  await dbConnection();
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    
    const skip = (page - 1) * limit;
    
    // Build query
    const query: any = {
      refundRequested: true
    };
    
    if (search) {
      query.$or = [
        { 'refundDetails.reason': { $regex: search, $options: "i" } }
      ];
    }
    
    if (status) {
      query.refundStatus = status;
    }
    
    // Get bookings with refunds with pagination
    const bookings = await BookingModel.find(query)
      .sort({ 'refundDetails.requestedAt': -1 })
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
        refunds: bookings,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error: any) {
    console.error("Error fetching refunds:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch refunds", error: error.message },
      { status: 500 }
    );
  }
}

// Process a refund
export async function POST(request: Request) {
  await dbConnection();
  
  try {
    const { bookingId, refundStatus, refundAmount, refundNotes } = await request.json();
    
    // Validate required fields
    if (!bookingId || !refundStatus) {
      return NextResponse.json(
        { success: false, message: "Booking ID and refund status are required" },
        { status: 400 }
      );
    }
    
    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return NextResponse.json(
        { success: false, message: "Invalid booking ID" },
        { status: 400 }
      );
    }
    
    // Check if booking exists
    const booking = await BookingModel.findById(bookingId);
    
    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }
    
    // Check if booking has refund requested
    if (!booking.refundRequested) {
      return NextResponse.json(
        { success: false, message: "This booking does not have a refund request" },
        { status: 400 }
      );
    }
    
    // Check if refund is already processed
    if (booking.refundStatus && booking.refundStatus !== "pending") {
      return NextResponse.json(
        { success: false, message: "Refund for this booking has already been processed" },
        { status: 400 }
      );
    }
    
    // Update booking with refund details
    const updatedBooking = await BookingModel.findByIdAndUpdate(
      bookingId,
      {
        $set: {
          refundStatus,
          refundAmount: refundAmount || booking.totalAmount,
          'refundDetails.processedAt': new Date(),
          'refundDetails.processedBy': "admin", // In a real app, this would be the admin's ID
          'refundDetails.notes': refundNotes || booking.refundDetails?.notes || ""
        }
      },
      { new: true }
    );
    
    // If refund is approved, update booking status to cancelled
    if (refundStatus === "approved") {
      await BookingModel.findByIdAndUpdate(
        bookingId,
        { $set: { status: "cancelled" } }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `Refund ${refundStatus} successfully`,
      data: updatedBooking
    });
  } catch (error: any) {
    console.error("Error processing refund:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process refund", error: error.message },
      { status: 500 }
    );
  }
} 
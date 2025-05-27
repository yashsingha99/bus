import { dbConnection } from "@/lib/db";
import { BookingModel } from "@/model/booking.model";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

// Get booking details
export async function GET(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  await dbConnection();
  
  try {
    const { bookingId } = params;
    
    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return NextResponse.json(
        { success: false, message: "Invalid booking ID" },
        { status: 400 }
      );
    }
    
    // Get booking details
    const booking = await BookingModel.findById(bookingId)
      .populate('bookedBy', 'fullName email phoneNumber')
      .populate('destination', 'name');
    
    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: booking
    });
  } catch (error: unknown) {
    console.error("Error fetching booking details:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { success: false, message: "Failed to fetch booking details", error: errorMessage },
      { status: 500 }
    );
  }
}

// Update booking
export async function PUT(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  await dbConnection();
  
  try {
    const { bookingId } = params;
    const updateData = await request.json();
    
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
    
    // Update booking
    const updatedBooking = await BookingModel.findByIdAndUpdate(
      bookingId,
      { $set: updateData },
      { new: true }
    );
    
    return NextResponse.json({
      success: true,
      message: "Booking updated successfully",
      data: updatedBooking
    });
  } catch (error: unknown) {
    console.error("Error updating booking:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { success: false, message: "Failed to update booking", error: errorMessage },
      { status: 500 }
    );
  }
}

// Delete booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  await dbConnection();
  
  try {
    const { bookingId } = params;
    
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
    
    // Delete booking
    await BookingModel.findByIdAndDelete(bookingId);
    
    return NextResponse.json({
      success: true,
      message: "Booking deleted successfully"
    });
  } catch (error: unknown) {
    console.error("Error deleting booking:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { success: false, message: "Failed to delete booking", error: errorMessage },
      { status: 500 }
    );
  }
} 
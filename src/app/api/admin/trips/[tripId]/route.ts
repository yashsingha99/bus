import { dbConnection } from "@/lib/db";
import { TripModel } from "@/model/trip.model";
import { BookingModel } from "@/model/booking.model";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

// Get trip details
export async function GET(
  request: NextRequest,
  { params }: { params: { tripId: string } }
) {
  await dbConnection();
  
  try {
    const { tripId } = params;
    
    // Validate trip ID
    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return NextResponse.json(
        { success: false, message: "Invalid trip ID" },
        { status: 400 }
      );
    }
    
    // Get trip details
    const trip = await TripModel.findById(tripId)
      .populate('destination', 'name');
    
    if (!trip) {
      return NextResponse.json(
        { success: false, message: "Trip not found" },
        { status: 404 }
      );
    }
    
    // Get trip's bookings
    const bookings = await BookingModel.find({ trip: tripId })
      .sort({ createdAt: -1 })
      .populate('bookedBy', 'fullName email phoneNumber')
      .populate('destination', 'name');
    
    return NextResponse.json({
      success: true,
      data: {
        trip,
        bookings
      }
    });
  } catch (error: any) {
    console.error("Error fetching trip details:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch trip details", error: error.message },
      { status: 500 }
    );
  }
}

// Update trip
export async function PUT(
  request: NextRequest,
  { params }: { params: { tripId: string } }
) {
  await dbConnection();
  
  try {
    const { tripId } = params;
    const updateData = await request.json();
    
    // Validate trip ID
    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return NextResponse.json(
        { success: false, message: "Invalid trip ID" },
        { status: 400 }
      );
    }
    
    // Check if trip exists
    const trip = await TripModel.findById(tripId);
    
    if (!trip) {
      return NextResponse.json(
        { success: false, message: "Trip not found" },
        { status: 404 }
      );
    }
    
    // If total seats is being updated, recalculate available seats
    if (updateData.totalSeats) {
      const currentBookings = await BookingModel.countDocuments({ 
        trip: tripId,
        status: { $ne: "cancelled" }
      });
      
      const newAvailableSeats = updateData.totalSeats - currentBookings;
      
      if (newAvailableSeats < 0) {
        return NextResponse.json(
          { 
            success: false, 
            message: `Cannot reduce total seats below ${currentBookings} as there are already ${currentBookings} bookings for this trip` 
          },
          { status: 400 }
        );
      }
      
      updateData.availableSeats = newAvailableSeats;
    }
    
    // Update trip
    const updatedTrip = await TripModel.findByIdAndUpdate(
      tripId,
      { $set: updateData },
      { new: true }
    );
    
    return NextResponse.json({
      success: true,
      message: "Trip updated successfully",
      data: updatedTrip
    });
  } catch (error: any) {
    console.error("Error updating trip:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update trip", error: error.message },
      { status: 500 }
    );
  }
}

// Delete trip
export async function DELETE(
  request: NextRequest,
  { params }: { params: { tripId: string } }
) {
  await dbConnection();
  
  try {
    const { tripId } = params;
    
    // Validate trip ID
    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return NextResponse.json(
        { success: false, message: "Invalid trip ID" },
        { status: 400 }
      );
    }
    
    // Check if trip exists
    const trip = await TripModel.findById(tripId);
    
    if (!trip) {
      return NextResponse.json(
        { success: false, message: "Trip not found" },
        { status: 404 }
      );
    }
    
    // Check if trip has bookings
    const bookingsCount = await BookingModel.countDocuments({ trip: tripId });
    
    if (bookingsCount > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Cannot delete trip with existing bookings. Consider cancelling the trip instead." 
        },
        { status: 400 }
      );
    }
    
    // Delete trip
    await TripModel.findByIdAndDelete(tripId);
    
    return NextResponse.json({
      success: true,
      message: "Trip deleted successfully"
    });
  } catch (error: any) {
    console.error("Error deleting trip:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete trip", error: error.message },
      { status: 500 }
    );
  }
} 
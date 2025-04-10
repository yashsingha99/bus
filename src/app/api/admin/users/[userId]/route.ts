import { dbConnection } from "@/lib/db";
import { UserModel } from "@/model/user.model";
import { BookingModel } from "@/model/booking.model";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

// Get user details
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  await dbConnection();
  
  try {
    const { userId } = params;
    
    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID" },
        { status: 400 }
      );
    }
    
    // Get user details
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    
    // Get user's bookings
    const bookings = await BookingModel.find({ bookedBy: userId })
      .sort({ createdAt: -1 })
      .populate('trip', 'busNumber departureTime arrivalTime')
      .populate('destination', 'name');
    
    return NextResponse.json({
      success: true,
      data: {
        user,
        bookings
      }
    });
  } catch (error: any) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch user details", error: error.message },
      { status: 500 }
    );
  }
}

// Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  await dbConnection();
  
  try {
    const { userId } = params;
    const updateData = await request.json();
    
    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID" },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    
    // Update user
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );
    
    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update user", error: error.message },
      { status: 500 }
    );
  }
}

// Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  await dbConnection();
  
  try {
    const { userId } = params;
    
    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID" },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    
    // Check if user has bookings
    const bookingsCount = await BookingModel.countDocuments({ bookedBy: userId });
    
    if (bookingsCount > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Cannot delete user with existing bookings. Consider deactivating the user instead." 
        },
        { status: 400 }
      );
    }
    
    // Delete user
    await UserModel.findByIdAndDelete(userId);
    
    return NextResponse.json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete user", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await dbConnection();
    const { userId } = params;
    const body = await request.json();

    const { name, email, phoneNumber, role } = body;

    // Validate required fields
    if (!name || !email || !phoneNumber || !role) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { name, email, phoneNumber, role },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update user" },
      { status: 500 }
    );
  }
} 
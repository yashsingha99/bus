import { NextRequest, NextResponse } from "next/server";
import { BookingModel } from "@/model/booking.model";
import { UserModel } from "@/model/user.model";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.pickupAddress || !body.bookedBy || !body.time || !body.totalAmount || !body.paymentProof) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    const user = await UserModel.findOne({ clerkId: body.bookedBy });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 400 }
      );
    }
    // Create booking
    const booking = await BookingModel.create({
      pickupAddress: body.pickupAddress,
      bookedBy: user._id,
      destination: body.destination,
      time: body.time,
      totalAmount: body.totalAmount,
      status: body.status || 'pending',
      paymentStatus: body.paymentStatus || 'pending',
      paymentProof: body.paymentProof,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return NextResponse.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

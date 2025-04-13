import { dbConnection } from "@/lib/db";
import { BookingModel } from "@/model/booking.model";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  await dbConnection();

  try {
    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json(
        { message: "Booking ID is required!" },
        { status: 400 }
      );
    }

    const booking = await BookingModel.findById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found!" },
        { status: 404 }
      );
    }

    // Check if booking is already cancelled
    if (booking.status === "cancelled") {
      return NextResponse.json(
        { message: "Booking is already cancelled!" },
        { status: 400 }
      );
    }

    // Update the booking status to cancelled
    const updatedBooking = await BookingModel.findByIdAndUpdate(
      bookingId,
      { $set: { status: "cancelled" } },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      {
        message: "Booking cancelled successfully!",
        data: updatedBooking,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Something went wrong!", error: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unknown error", error);
    }
  }
}

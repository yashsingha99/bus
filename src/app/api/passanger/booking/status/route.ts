import { dbConnection } from "@/lib/db";
import { BookingModel } from "@/model/booking.model";
import { NextResponse } from "next/server";
export async function PUT(request: Request) {
  await dbConnection();

  try {
    const { bookingId, status } = await request.json();

    if (!bookingId || !status) {
      return NextResponse.json(
        { message: "Booking ID and status are required!" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ["pending", "confirmed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: `Status must be one of: ${validStatuses.join(", ")}` },
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

    // Update the booking status
    const updatedBooking = await BookingModel.findByIdAndUpdate(
      bookingId,
      { $set: { status } },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      {
        message: "Booking status updated successfully!",
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

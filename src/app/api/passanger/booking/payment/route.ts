import { dbConnection } from "@/lib/db";
import { BookingModel } from "@/model/booking.model";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  await dbConnection();

  try {
    const { bookingId, paymentStatus } = await request.json();

    if (!bookingId || !paymentStatus) {
      return NextResponse.json(
        { message: "Booking ID and payment status are required!" },
        { status: 400 }
      );
    }

    // Validate payment status
    const validPaymentStatuses = ["pending", "completed", "failed"];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return NextResponse.json(
        {
          message: `Payment status must be one of: ${validPaymentStatuses.join(", ")}`,
        },
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

    // Update the payment status
    const updatedBooking = await BookingModel.findByIdAndUpdate(
      bookingId,
      { $set: { paymentStatus } },
      { new: true, runValidators: true }
    );

    // If payment is completed, update booking status to confirmed
    if (paymentStatus === "completed" && booking.status === "pending") {
      await BookingModel.findByIdAndUpdate(
        bookingId,
        { $set: { status: "confirmed" } },
        { new: true, runValidators: true }
      );
    }

    return NextResponse.json(
      {
        message: "Payment status updated successfully!",
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

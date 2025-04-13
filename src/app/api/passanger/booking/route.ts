import { dbConnection } from "@/lib/db";
import { BookingModel } from "@/model/booking.model";
import { TripModel } from "@/model/trip.model";
import { NextResponse } from "next/server";
import { UserModel } from "@/model/user.model";

interface BookingData {
  pickupAddress: string;
  bookedBy: string; // Clerk ID
  destination: string;
  time: string;
  totalAmount: number;
  paymentId: string; 
  status: string;
  paymentStatus: string;
}

interface ValidationError extends Error {
  errors: {
    [key: string]: {
      message: string;
    };
  };
}

interface CastError extends Error {
  path: string;
}

// Get all refunds with pagination
export async function POST(request: Request) {
  await dbConnection();
  try {
    const bookingData = await request.json() as BookingData;

    const requiredFields = [
      "pickupAddress",
      "bookedBy",  
      "destination",
      "time",
      "totalAmount",
      "paymentId",
      "status",
      "paymentStatus"
    ];
   // @ts-expect-error-ignore
    const missingFields = requiredFields.filter((field) => !bookingData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate trip exists
    const trip = await TripModel.findById(bookingData.destination);
    if (!trip) {
      return NextResponse.json({ message: "Trip not found" }, { status: 404 });
    }

    // Find user by Clerk ID
    const user = await UserModel.findById(bookingData.bookedBy);
    console.log(user);
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Create the booking with the user's MongoDB ID
    const newBooking = await BookingModel.create({
      ...bookingData,
      bookedBy: user._id, // Use the MongoDB user ID
      status: "pending",
      paymentStatus: "pending",
    });

    return NextResponse.json(
      {
        message: "Booking created successfully!",
        data: newBooking,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating booking:", error);

    // Handle specific MongoDB errors
    if (error instanceof Error) {
      if (error.name === "ValidationError") {
        const validationError = error as ValidationError;
        const validationErrors = Object.values(validationError.errors).map(
          (err) => err.message
        );
        return NextResponse.json(
          { message: "Validation error", errors: validationErrors },
          { status: 400 }
        );
      }

      if (error.name === "CastError") {
        const castError = error as CastError;
        return NextResponse.json(
          { message: "Invalid ID format", field: castError.path },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { message: "Something went wrong!", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Something went wrong!", error: "Unknown error occurred" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnection();

  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("bookingId");
    const userId = searchParams.get("userId");

    // Get booking by ID
    console.log(userId);

    if (bookingId) {
      const booking = await BookingModel.findById(bookingId)
        .populate("destination")
        .populate("bookedBy", "name email");

      if (!booking) {
        return NextResponse.json(
          { message: "Booking not found!" ,
           status: 200, error: true
          }
        );
      }

      return NextResponse.json(
        {
          message: "Booking retrieved successfully!",
          data: booking,
        },
        { status: 200 }
      );
    }

    // Get bookings by user ID
    if (userId) {
      const user = await UserModel.findById(userId);
      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
      const bookings = await BookingModel.find({ bookedBy: user._id })
        .select("pickupAddress destination status paymentStatus")
        .populate("destination")
        .sort({ createdAt: -1 });

      return NextResponse.json(
        {
          message: "User bookings retrieved successfully!",
          data: bookings,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Booking ID or User ID is required!" },
      { status: 400 }
    );
  } catch (error: unknown) {
    console.error("Error retrieving booking(s):", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { message: "Something went wrong!", error: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  await dbConnection();

  try {
    const { bookingId, ...updateData } = await request.json();

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

    // Update the booking
    const updatedBooking = await BookingModel.findByIdAndUpdate(
      bookingId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      {
        message: "Booking updated successfully!",
        data: updatedBooking,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating booking:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { message: "Something went wrong!", error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  await dbConnection();

  try {
    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json(
        { message: "Booking ID is required!" },
        { status: 400 }
      );
    }

    const booking = await BookingModel.findByIdAndDelete(bookingId);
    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found!" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Booking deleted successfully!" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error deleting booking:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { message: "Something went wrong!", error: errorMessage },
      { status: 500 }
    );
  }
}

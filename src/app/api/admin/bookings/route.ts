import { NextResponse } from "next/server";
import { dbConnection } from "@/lib/db";
import { BookingModel } from "@/model/booking.model";

export async function GET(request: Request) {
  try {
    await dbConnection();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const paymentStatus = searchParams.get("status");
    const search = searchParams.get("search");

    const query: Record<string, unknown> = {};

    if (paymentStatus && paymentStatus !== "all") {
      query.paymentStatus = paymentStatus;
    }

    const skip = (page - 1) * limit;

    // Fetch bookings
    let bookings = await BookingModel.find(query)
      .sort({ createdAt: -1 })
      .populate({
        path: "bookedBy",
        select: "fullName email phone",
        match: { _id: { $exists: true } },
        model: "UserModel",
      })
      .populate({
        path: "destination",
        select: "destinationAddress",
        match: { _id: { $exists: true } },
        model: "TripModel",
      })
      .lean();

    // In-memory search filter
    if (search) {
      const regex = new RegExp(search, "i");
      bookings = bookings.filter(
        (b) =>
          regex.test(b.pickupAddress) ||
          regex.test(b.bookedBy?.fullName || "") ||
          regex.test(b.bookedBy?.email || "") ||
          regex.test(b.bookedBy?.phone || "") ||
          regex.test(b.destination?.destinationAddress || "")
      );
    }

    const total = bookings.length;
    const paginatedData = bookings.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      data: paginatedData,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await dbConnection();

  try {
    const bookingData = await request.json();

    const requiredFields = [
      "pickupAddress",
      "bookedBy",
      "destination",
      "time",
      "totalAmount",
      "paymentId",
    ];

    const missingFields = requiredFields.filter((field) => !bookingData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }


    const isPaymentExist = await BookingModel.find({
      paymentId: bookingData.paymentId,
    });
    console.log(isPaymentExist);
    
    if (isPaymentExist && isPaymentExist.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment already Exist",
        },
        { status: 400 }
      );
    }
    const newBooking = await BookingModel.create({
      ...bookingData,
      status: "confirmed",
      paymentStatus: "completed",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Booking created successfully",
        data: newBooking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create booking" },
      { status: 500 }
    );
  }
}

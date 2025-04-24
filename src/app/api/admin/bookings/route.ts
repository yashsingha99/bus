import { dbConnection } from "@/lib/db";
import { BookingModel } from "@/model/booking.model";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await dbConnection();

    const { searchParams } = new URL(request.url);
    // const page = parseInt(searchParams.get("page") || "1");
    // const limit = parseInt(searchParams.get("limit") || "10");
    // const paymentStatus = searchParams.get("status");
    const search = searchParams.get("search");

    const query: Record<string, unknown> = {};

    // if (paymentStatus && paymentStatus !== "all") {
    //   query.paymentStatus = paymentStatus;
    // }

    // const skip = (page - 1) * limit;

    // Fetch total count before filtering
    // const total = await BookingModel.countDocuments(query);

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

    // Apply in-memory search filter
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

    // const paginatedData = bookings.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      data: bookings,
      // pagination: {
      //   total,
      //   page,
      //   limit,
      //   totalPages: Math.ceil(total / limit),
      // },
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
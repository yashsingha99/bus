import { dbConnection } from "@/lib/db";
import { ITrip, TripModel } from "@/model/trip.model";
import { NextRequest, NextResponse } from "next/server";
import { FilterQuery } from "mongoose";
// Get all trips with pagination
export async function GET(request: NextRequest) {
  await dbConnection();

  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    const skip = (page - 1) * limit;

    // Define query type
    const query: FilterQuery<ITrip> = {};

    if (search) {
      query.$or = [
        { busNumber: { $regex: search, $options: "i" } },
        { driverName: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      query.status = status;
    }

    const trips = await TripModel.find(query)
      .sort({ departureTime: 1 })
      .skip(skip)
      .limit(limit)
      .populate("destination", "name");

    const total = await TripModel.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: {
        trips,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching trips:", error.message);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch trips",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, message: "An unknown error occurred" },
      { status: 500 }
    );
  }
}

// Create a new trip
export async function POST(request: Request) {
  await dbConnection();

  try {
    const tripData = await request.json();

    // Validate required fields
    const requiredFields = [
      "busNumber",
      "driverName",
      "driverPhone",
      "departureTime",
      "arrivalTime",
      "destination",
      "price",
      "totalSeats",
    ];

    const missingFields = requiredFields.filter((field) => !tripData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Check if trip with same bus number and departure time already exists
    const existingTrip = await TripModel.findOne({
      busNumber: tripData.busNumber,
      departureTime: tripData.departureTime,
    });

    if (existingTrip) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A trip with this bus number and departure time already exists",
        },
        { status: 400 }
      );
    }

    // Create new trip
    const newTrip = await TripModel.create({
      ...tripData,
      status: "scheduled",
      availableSeats: tripData.totalSeats,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Trip created successfully",
        data: newTrip,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create trip",
          error: error.message,
        },
        { status: 500 }
      );
    } else {
      console.error("Unknown error", error);
    }
  }
}

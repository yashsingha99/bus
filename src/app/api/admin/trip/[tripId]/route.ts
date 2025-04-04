import { NextResponse } from "next/server";
import { dbConnection } from "@/lib/db";
import { TripModel } from "@/model/trip.model";


export async function GET(
  request: Request,
  { params }: { params: { tripId: string } }
) {
  await dbConnection();

  try {
    const trip = await TripModel.findById(params.tripId);

    if (!trip) {
      return NextResponse.json(
        { message: "Trip not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Trip retrieved successfully", data: trip },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching trip:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 


export async function PUT(
  request: Request,
  { params }: { params: { tripId: string } }
) {
  await dbConnection();

  try {
    const tripData = await request.json();
    const { tripId } = params;
    // console.log(tripData);
    
    const updatedTrip = await TripModel.findByIdAndUpdate(tripId, tripData);

    if (!updatedTrip) {
      return NextResponse.json(
        {
          success: false,
          message: "Trip not found or could not be updated.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Trip updated successfully.",
        data: updatedTrip,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating trip:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again later.",
      },
      { status: 500 }
    );
  }
} 
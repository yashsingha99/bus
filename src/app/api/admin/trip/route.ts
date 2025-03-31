import { NextRequest, NextResponse } from "next/server";

import { TripModel } from "../../../../model/trip.model";
import { dbConnection } from "@/lib/db";
import { SingleTrip } from "../../../../model/trip.model";

export async function POST(request: NextRequest) {
  await dbConnection();

  try {
    const { Trips, destinationAddress } = await request.json();
    if (!Trips || !destinationAddress) {
      return NextResponse.json(
        { success: false, message: "Required fields are missing." },
        { status: 400 }
      );
    }
    // const existingTrip = await TripModel.findOne({
    //   $and: [{ destinationAddress }],
    // });
    const existingTrip = await TripModel.findOne({ destinationAddress });

    if (existingTrip) {
      return NextResponse.json(
        {
          success: false,
          message: "A trip already exists with this destination address.",
        },
        { status: 400 }
      );
    }

    const newTrip = await TripModel.create({
      Trips,
      destinationAddress,
      // owner,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Trip successfully created.",
        data: newTrip,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating trip:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again later.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnection();

  try {
    const trips = await TripModel.find();

    return NextResponse.json(
      {
        success: true,
        message: "Trips retrieved successfully.",
        data: trips,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Error fetching trips:",
      error instanceof Error ? error.stack : error
    );
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again later.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  await dbConnection();

  try {
    const { destinationAddress, Trips } = await request.json();

    const updatedTrip = await TripModel.findOneAndUpdate(
      { destinationAddress },
      { Trips }
    );

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

export async function DELETE(request: Request) {
  await dbConnection();

  try {
    const { id } = await request.json();

    const deletedTrip = await TripModel.findByIdAndDelete(id);

    if (!deletedTrip) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Trip not found or could not be deleted.",
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Trip deleted successfully.",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting trip:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error. Please try again later.",
      }),
      { status: 500 }
    );
  }
}

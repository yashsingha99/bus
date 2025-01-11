import { TripModel } from "../../../../model/trip.model";
import { dbConnection } from "@/lib/db";

export async function POST(request: Request) {
  await dbConnection();

  try {
    const { price, status, destinationAddress, dateTiming } =
      await request.json();

    const existingTrip = await TripModel.findOne({ destinationAddress });
    if (existingTrip) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "A trip already exists with this destination address.",
        }),
        { status: 400 }
      );
    }

    const newTrip = await TripModel.create({
      price,
      status,
      destinationAddress,
      dateTiming,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Trip successfully created.",
        data: newTrip,
      }),
      { status: 201 } // Resource created
    );
  } catch (error) {
    console.error("Error creating trip:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error. Please try again later.",
      }),
      { status: 500 }
    );
  }
}


export async function GET(request: Request) {
  await dbConnection();

  try {
    const trips = await TripModel.find(); // Retrieve all trips

    return new Response(
      JSON.stringify({
        success: true,
        message: "Trips retrieved successfully.",
        data: trips,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching trips:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error. Please try again later.",
      }),
      { status: 500 }
    );
  }
}


export async function PUT(request: Request) {
  await dbConnection();

  try {
    const { id, price, status, destinationAddress, dateTiming } =
      await request.json();

    const updatedTrip = await TripModel.findByIdAndUpdate(
      id,
      {
        price,
        status,
        destinationAddress,
        dateTiming,
      },
      { new: true } // Return the updated document
    );

    if (!updatedTrip) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Trip not found or could not be updated.",
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Trip updated successfully.",
        data: updatedTrip,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating trip:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error. Please try again later.",
      }),
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

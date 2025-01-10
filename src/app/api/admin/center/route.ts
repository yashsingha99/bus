import { TripModel } from "../../../../model/trip.model";
import { dbConnection } from "@/lib/db";

export async function POST(request: Request) {
  await dbConnection();

  try {
    const { amount, status, center, dateTiming, busBook } =
      await request.json();

      

  } catch (error) {
    // ******************** An error occurred during the login process ************** //

    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error. Please try again later",
      }),
      { status: 500 } // Internal Server Error
    );
  }
}

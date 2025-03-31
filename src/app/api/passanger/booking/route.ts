import { dbConnection } from "@/lib/db";
import { BookingModel } from "@/model/booking.model";
import { TripModel } from "@/model/trip.model";
import { NextRequest, NextResponse } from "next/server";
interface BookingRequest {
      bookingId?: string;
      seats?: number;
      dateTiming?: {
        date: string;
        Timing: string;
      };
}

export async function POST(request: Request) {
  await dbConnection(); 
  try {
    const { user, tripId, dateTiming, seats } = await request.json();
    
    if (!user || !tripId || !dateTiming || !dateTiming.Timing || !dateTiming.date || !seats) {
      return NextResponse.json(
         { message: "All fields are required!" },
         { status: 400 }
      );
    } 

 
  const trip = await TripModel.findById(tripId);
    if (!trip) {
      return new Response(
        JSON.stringify({ message: "Trip not found!" }),
        { status: 404 }
      );
    }

    // Check if the selected dateTiming is valid for this trip
    const isValidTiming = trip.DateTiming.some(
      (dt) => dt.Timing === dateTiming.Timing && new Date(dt.date).toISOString() === new Date(dateTiming.date).toISOString()
    );

    if (!isValidTiming) {
      return new Response(
        JSON.stringify({ message: "Invalid dateTiming for the selected trip!" }),
        { status: 400 }
      );
    }

    // Calculate total price
    const totalPrice = trip.price * seats;

    // Create the booking
    const newBooking = await BookingModel.create({
      user,
      trip: tripId,
      dateTiming,
      seats,
      totalPrice,
    });

    return new Response(
      JSON.stringify({
        message: "Booking created successfully!",
        booking: newBooking,
      }),
      { status: 201 }
    );
  } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error updating booking:", error.message);
        return new Response(
          JSON.stringify({ message: "Something went wrong!", error: error.message }),
          { status: 500 }
        );
      }
    
      // If the error is not an instance of Error, handle it as a generic unknown type
      console.error("Unexpected error:", error);
      return new Response(
        JSON.stringify({ message: "Something went wrong!", error: "Unexpected error" }),
        { status: 500 }
      );
    }
    
}

export async function GET(request: Request) {
      await dbConnection();
    
      try {
            const { searchParams } = new URL(request.url);
            const bookingId = searchParams.get("bookingId");
    
        if (!bookingId) {
          return new Response(
            JSON.stringify({ message: "Booking ID is required!" }),
            { status: 400 }
          );
        }
    
        const booking = await BookingModel.findById(bookingId).populate("trip");
    
        if (!booking) {
          return new Response(
            JSON.stringify({ message: "Booking not found!" }),
            { status: 404 }
          );
        }
    
        return new Response(
          JSON.stringify({
            message: "Booking retrieved successfully!",
            booking,
          }),
          { status: 200 }
        );
      } catch (error: unknown) {
            if (error instanceof Error) {
              console.error("Error updating booking:", error.message);
              return new Response(
                JSON.stringify({ message: "Something went wrong!", error: error.message }),
                { status: 500 }
              );
            }
          
            // If the error is not an instance of Error, handle it as a generic unknown type
            console.error("Unexpected error:", error);
            return new Response(
              JSON.stringify({ message: "Something went wrong!", error: "Unexpected error" }),
              { status: 500 }
            );
          }
          
    }


    export async function PUT(request: Request) {
      await dbConnection();
    
      try {
        const { bookingId, seats, dateTiming }   = await request.json();
    
        if (!bookingId || !seats || !dateTiming) {
          return new Response(
            JSON.stringify({ message: "All fields are required!" }),
            { status: 400 }
          );
        }
    
        const booking = await BookingModel.findById(bookingId);
        if (!booking) {
          return new Response(
            JSON.stringify({ message: "Booking not found!" }),
            { status: 404 }
          );
        }
    
        // Update the booking with new seats and dateTiming
        booking.seats = seats;
        booking.dateTiming = dateTiming;
        booking.totalPrice = booking.trip.price * seats; // Recalculate the price
    
        await booking.save();
    
        return new Response(
          JSON.stringify({
            message: "Booking updated successfully!",
            booking,
          }),
          { status: 200 }
        );
      } catch (error: unknown) {
            if (error instanceof Error) {
              console.error("Error updating booking:", error.message);
              return new Response(
                JSON.stringify({ message: "Something went wrong!", error: error.message }),
                { status: 500 }
              );
            }
          
            // If the error is not an instance of Error, handle it as a generic unknown type
            console.error("Unexpected error:", error);
            return new Response(
              JSON.stringify({ message: "Something went wrong!", error: "Unexpected error" }),
              { status: 500 }
            );
          }
      }          


    export async function DELETE(request: Request) {
      await dbConnection();
    
      try {
        const { bookingId } = await request.json();
    
        if (!bookingId) {
          return new Response(
            JSON.stringify({ message: "Booking ID is required!" }),
            { status: 400 }
          );
        }
    
        const booking = await BookingModel.findByIdAndDelete(bookingId);
        if (!booking) {
          return new Response(
            JSON.stringify({ message: "Booking not found!" }),
            { status: 404 }
          );
        }

        return new Response(
          JSON.stringify({ message: "Booking deleted successfully!" }),
          { status: 200 }
        );
      } catch (error) {
        console.error("Error deleting booking:", error);
        return new Response(
          JSON.stringify({ message: "Something went wrong!", error: error.message }),
          { status: 500 }
        );
      }
    }
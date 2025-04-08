import { dbConnection } from "@/lib/db";
import { BookingModel } from "@/model/booking.model";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await dbConnection();
  
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");
    
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required!" },
        { status: 400 }
      );
    }
    
    // Build query
    const query: any = { bookedBy: userId };
    
    // Add status filter if provided
    if (status) {
      const validStatuses = ["pending", "confirmed", "cancelled"];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { message: `Status must be one of: ${validStatuses.join(", ")}` },
          { status: 400 }
        );
      }
      query.status = status;
    }
    
    // Get bookings with populated fields
    const bookings = await BookingModel.find(query)
      .populate("trip")
      .populate("destination")
      .sort({ createdAt: -1 });
    
    return NextResponse.json(
      { 
        message: "User bookings retrieved successfully!",
        data: bookings
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error retrieving user bookings:", error);
    return NextResponse.json(
      { message: "Something went wrong!", error: error.message },
      { status: 500 }
    );
  }
} 
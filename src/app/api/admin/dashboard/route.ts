import { dbConnection } from "@/lib/db";
import { BookingModel } from "@/model/booking.model";
import { TripModel } from "@/model/trip.model";
import { UserModel } from "@/model/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnection();

  try {
    // Get total users count
    const totalUsers = await UserModel.countDocuments();

    // Get total trips count
    const totalTrips = await TripModel.countDocuments();

    // Get total bookings count
    const totalBookings = await BookingModel.countDocuments();

    // Get recent bookings (last 10)
    const recentBookings = await BookingModel.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("bookedBy", "fullName email");
    // .populate('destination', ' ');

    // Get booking statistics
    const bookingStats = await BookingModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get payment statistics
    const paymentStats = await BookingModel.aggregate([
      {
        $group: {
          _id: "$paymentStatus",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);

    // Get revenue data (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dayByRevenue = await BookingModel.aggregate([
      {
        $match: {
          paymentStatus: "completed",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          revenue: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const totalRevenue = dayByRevenue.reduce(
      (sum, item) => sum + item.revenue,
      0
    );

    const dailyUserRegistrations = await UserModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalTrips,
        totalBookings,
        recentBookings,
        bookingStats,
        paymentStats,
        revenue: { dayByRevenue, totalRevenue },
        dailyUserRegistrations,
      },
    });
  } catch (error: any) {
    console.error("Error fetching admin dashboard data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch dashboard data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

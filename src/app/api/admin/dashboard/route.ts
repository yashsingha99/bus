// File: /app/api/admin/dashboard/route.ts
import { dbConnection } from "@/lib/db";
import { BookingModel } from "@/model/booking.model";
import { TripModel } from "@/model/trip.model";
import { UserModel } from "@/model/user.model";
import { NextResponse } from "next/server";

// Define types for the API response
interface BookingStat {
  _id: string;
  count: number;
}

interface PaymentStat {
  _id: string;
  count: number;
  totalAmount: number;
}

interface RevenueData {
  date: string;
  amount: number;
}

interface RegistrationStat {
  _id: string;
  count: number;
}

interface DashboardApiData {
  totalUsers: number;
  totalTrips: number;
  totalBookings: number;
  recentBookings: any[]; // Type depends on your BookingModel populate
  bookingStats: BookingStat[];
  paymentStats: PaymentStat[];
  revenueData: RevenueData[];
  dailyUserRegistrations: RegistrationStat[];
  revenue: {
    totalRevenue: number;
    dayByRevenue: {
      _id: string;
      revenue: number;
    }[];
  };
}

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

    const revenueData = await BookingModel.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          paymentStatus: "completed",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          amount: { $sum: "$totalAmount" },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          amount: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);

    // Get daily user registrations (last 7 days)
    const dailyUserRegistrations = await UserModel.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Calculate total revenue
    const totalRevenue = paymentStats.find(stat => stat._id === "completed")?.totalAmount || 0;

    const dashboardData: DashboardApiData = {
      totalUsers,
      totalTrips,
      totalBookings,
      recentBookings,
      bookingStats,
      paymentStats,
      revenueData,
      dailyUserRegistrations,
      revenue: {
        totalRevenue,
        dayByRevenue: revenueData.map(item => ({
          _id: item.date,
          revenue: item.amount
        }))
      }
    };

    return NextResponse.json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { success: false, message: "Failed to fetch dashboard data", error: errorMessage },
      { status: 500 }
    );
  }
}
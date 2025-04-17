"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import AdminStats from "./_components/AdminStats";
// import { toast } from "sonner";
import { FeedbackButton } from "@/components/ui/feedback-button";
import { Component as Analytics } from "./_components/Analytics";
import Auth from "@/components/model/auth";
import { User } from "@/types/user.type";

interface DashboardData {
  totalUsers: number;
  totalTrips: number;
  totalBookings: number;
  recentBookings: Array<{
    _id: string;
    bookedBy: {
      _id: string;
      fullName: string;
      email: string;
    };
    trip: {
      _id: string;
      busNumber: string;
      departureTime: string;
      arrivalTime: string;
    };
    destination: {
      _id: string;
      name: string;
    };
    pickupAddress: string;
    time: string;
    status: string;
    paymentStatus: string;
    totalAmount: number;
    createdAt: string;
  }>;
  bookingStats: Array<{
    _id: string;
    count: number;
  }>;
  paymentStats: Array<{
    _id: string;
    count: number;
    totalAmount: number;
  }>;
  revenueData: Array<{
    _id: string;
    revenue: number;
    count: number;
  }>;
  revenue: {
    totalRevenue: number;
    dayByRevenue: Array<{
      _id: string;
      revenue: number;
    }>;
  };
  dailyUserRegistrations: Array<{
    _id: string;
    count: number;
  }>;
}

interface AdminStats {
  totalUsers: number;
  totalTrips: number;
  totalBookings: number;
  revenue: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  ); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
   const [user, setUser] = useState<User | null>(null);

   useEffect(() => {
     if (typeof window !== "undefined") {
       const userString = localStorage.getItem("user");
       const userData = userString ? JSON.parse(userString) : null;
       if (userData?.role !== "NATRAJ121290") {
         router.push("/");
       }
       setUser(userData);
     }
   }, [router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        const response = await axios.get("/api/admin/dashboard");
      
        setDashboardData(response.data.data);
      } catch (err) {
        if(err){
          setError("Failed to fetch dashboard data. Please try again later.");
        }
        else {
          setError("Failed to fetch dashboard data. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

    if (!user) {
      return (
        <div className="container mx-auto p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              Please sign in to view your DashBoard
            </h1>

            <Auth
              navigateRoute=""
              callback={[
                () => {
                  window.location.reload();
                },
              ]}
              state={() => {}}
            >
              <Button>Sign In</Button>
            </Auth>
          </div>
        </div>
      );
    }

  if (!dashboardData || loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center text-red-500">
          <h1 className="text-2xl font-bold mb-4">{error}</h1>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <Link href="/AATKHARK/users">
            <FeedbackButton>Users</FeedbackButton>
          </Link>
          <Link href="/AATKHARK/trips">
            <FeedbackButton>Trips</FeedbackButton>
          </Link>
          <Link href="/AATKHARK/reserved-users">
            <FeedbackButton>Bookings</FeedbackButton>
          </Link>
          {/* <Link href="/AATKHARK/refunds">
            <FeedbackButton>Refunds</FeedbackButton>
          </Link> */}
        </div>
      </div>

      <Tabs defaultValue="overview" className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <AdminStats
            stats={{
              totalUsers: dashboardData?.totalUsers || 0,
              totalTrips: dashboardData?.totalTrips || 0,
              totalBookings: dashboardData?.totalBookings || 0,
              revenue: dashboardData?.revenue?.totalRevenue || 0,
            }}
            isLoading={loading}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Booking Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dashboardData.bookingStats.map((stat) => (
                    <div key={stat._id} className="flex justify-between">
                      <span className="capitalize">
                        {stat._id || "Unknown"}
                      </span>
                      <span className="font-medium">{stat.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dashboardData.paymentStats.map((stat) => (
                    <div key={stat._id} className="flex justify-between">
                      <span className="capitalize">
                        {stat._id || "Unknown"}
                      </span>
                      <span className="font-medium">{stat.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics">
          <Analytics
            dayByRevenue={dashboardData?.revenue?.dayByRevenue || 0}
            dailyUserRegistrations={dashboardData?.dailyUserRegistrations || 0}
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Booking Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+20.1%</div>
                <p className="text-xs text-muted-foreground">
                  +180.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Revenue Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+15.3%</div>
                <p className="text-xs text-muted-foreground">
                  +120.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  User Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12.5%</div>
                <p className="text-xs text-muted-foreground">
                  +90.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Trip Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+8.2%</div>
                <p className="text-xs text-muted-foreground">
                  +60.1% from last month
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="reports">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Report</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Download monthly booking and revenue reports
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>User Report</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Download user registration and activity reports
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Trip Report</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Download trip performance and occupancy reports
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Revenue Report</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Download detailed revenue and payment reports
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-10 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Skeleton className="h-10 w-full mb-4" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

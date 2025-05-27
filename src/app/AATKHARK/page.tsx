"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Auth from "@/components/model/auth";
import Link from "next/link";
// import { User } from "@/types/user.type";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";
import { useLoadUser } from "@/hooks/useLoadUser";

// Types
interface BookingStat { _id: string; count: number; }
interface PaymentStat { _id: string; count: number; totalAmount: number; }
interface RevenueStat { _id: string; revenue: number; }
interface RegistrationStat { _id: string; count: number; }
interface RecentBooking { fullName: string; email: string; }

interface DashboardData {
  totalUsers: number;
  totalTrips: number;
  totalBookings: number;
  recentBookings: RecentBooking[];
  bookingStats: BookingStat[];
  paymentStats: PaymentStat[];
  revenue: {
    totalRevenue: number;
    dayByRevenue: RevenueStat[];
  };
  dailyUserRegistrations: RegistrationStat[];
}

export default function AdminDashboard() {
  // const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  
  // Use custom hook for loading user
  const { user, loading: userLoading, error: userError } = useLoadUser("NATRAJ121290");

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setDashboardLoading(true);
        const { data } = await axios.get("/api/admin/dashboard");
        
        // Transform the API response to match our frontend data structure
        const transformedData: DashboardData = {
          totalUsers: data.data.totalUsers,
          totalTrips: data.data.totalTrips,
          totalBookings: data.data.totalBookings,
          recentBookings: data.data.recentBookings,
          bookingStats: data.data.bookingStats,
          paymentStats: data.data.paymentStats,
          revenue: data.data.revenue || {
            totalRevenue: data.data.paymentStats.find((stat: PaymentStat) => 
              stat._id === "completed")?.totalAmount || 0,
            dayByRevenue: data.data.revenueData?.map((item: {date: string, amount: number}) => ({
              _id: item.date,
              revenue: item.amount
            })) || []
          },
          dailyUserRegistrations: data.data.dailyUserRegistrations || []
        };
        
        setDashboardData(transformedData);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setDashboardError("Failed to fetch dashboard data. Please try again later.");
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (userLoading || (user && dashboardLoading)) {
    return <LoadingSkeleton />;
  }

  if (userError) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        <h1 className="text-2xl font-bold mb-4">{userError}</h1>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Please sign in to view your dashboard</h1>
        <Auth navigateRoute="" callback={[() => window.location.reload()]} state={() => {}}>
          <Button>Sign In</Button>
        </Auth>
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        <h1 className="text-2xl font-bold mb-4">{dashboardError}</h1>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  if (!dashboardData) {
    return <LoadingSkeleton />;
  }

  // const mergedAnalyticsData = Array.from(
  //   new Set([
  //     ...dashboardData.revenue.dayByRevenue.map((d) => d._id),
  //     ...dashboardData.dailyUserRegistrations.map((d) => d._id),
  //   ])
  // )
  //   .sort()
  //   .map((date) => {
  //     const revenueData = dashboardData.revenue.dayByRevenue.find((d) => d._id === date);
  //     const userData = dashboardData.dailyUserRegistrations.find((d) => d._id === date);
  //     return {
  //       date,
  //       revenue: revenueData?.revenue || 0,
  //       users: userData?.count || 0,
  //     };
  //   });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <Link href="/AATKHARK/users"><Button variant="outline">Users</Button></Link>
          <Link href="/AATKHARK/trips"><Button variant="outline">Trips</Button></Link>
          <Link href="/AATKHARK/reserved-users"><Button variant="outline">Bookings</Button></Link>
        </div>
      </div>

      <Tabs defaultValue="overview" className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card><CardHeader><CardTitle>Total Users</CardTitle></CardHeader><CardContent>{dashboardData.totalUsers}</CardContent></Card>
            <Card><CardHeader><CardTitle>Total Trips</CardTitle></CardHeader><CardContent>{dashboardData.totalTrips}</CardContent></Card>
            <Card><CardHeader><CardTitle>Total Bookings</CardTitle></CardHeader><CardContent>{dashboardData.totalBookings}</CardContent></Card>
            <Card><CardHeader><CardTitle>Total Revenue</CardTitle></CardHeader><CardContent>₹{dashboardData.revenue.totalRevenue}</CardContent></Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Booking Status</CardTitle></CardHeader>
              <CardContent>
                {dashboardData.bookingStats.map((stat) => (
                  <div key={stat._id} className="flex justify-between py-1 border-b last:border-none">
                    <span>{stat._id || "Unknown"}</span>
                    <span>{stat.count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Payment Status</CardTitle></CardHeader>
              <CardContent>
                {dashboardData.paymentStats.map((stat) => (
                  <div key={stat._id} className="flex justify-between py-1 border-b last:border-none">
                    <span>{stat._id || "Unknown"}</span>
                    <span>{stat.count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <RevenueChart 
            dayByRevenue={dashboardData.revenue.dayByRevenue} 
            dailyUserRegistrations={dashboardData.dailyUserRegistrations}
          />
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {["Monthly", "User", "Trip", "Revenue"].map((type) => (
              <Card key={type}>
                <CardHeader><CardTitle>{type} Report</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Download {type.toLowerCase()} data reports
                  </p>
                  <Button variant="secondary" className="mt-2 w-full">Download</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface RevenueChartProps {
  dayByRevenue: RevenueStat[];
  dailyUserRegistrations: RegistrationStat[];
}

function RevenueChart({ dayByRevenue = [], dailyUserRegistrations = [] }: RevenueChartProps) {
  const mergedData = Array.from(new Set([
    ...dayByRevenue.map(d => d._id),
    ...dailyUserRegistrations.map(d => d._id)
  ]))
    .sort()
    .map(date => {
      const revenueEntry = dayByRevenue.find(d => d._id === date);
      const userEntry = dailyUserRegistrations.find(d => d._id === date);
      return {
        date,
        revenue: revenueEntry?.revenue || 0,
        users: userEntry?.count || 0,
      };
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Revenue & Signups</CardTitle>
        <CardDescription>Tracking per-day revenue and user registrations</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
            users: { label: "User Signups", color: "hsl(var(--chart-2))" },
          }}
        >
          <AreaChart data={mergedData} margin={{ left: -20, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(5)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={4}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Area
              dataKey="revenue"
              type="monotone"
              stroke="var(--color-revenue)"
              fill="var(--color-revenue)"
              fillOpacity={0.3}
              stackId="1"
            />
            <Area
              dataKey="users"
              type="monotone"
              stroke="var(--color-users)"
              fill="var(--color-users)"
              fillOpacity={0.3}
              stackId="1"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex items-center gap-2 font-medium">
            Trending up this week <TrendingUp className="h-4 w-4" />
          </div>
          <p className="text-muted-foreground">
            From {mergedData[0]?.date} to {mergedData.at(-1)?.date}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto p-4">
      <Skeleton className="h-10 w-40 mb-4" />
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}><CardHeader><Skeleton className="h-6 w-24" /></CardHeader><CardContent><Skeleton className="h-6 w-16" /></CardContent></Card>
        ))}
      </div>
      <Skeleton className="h-80 w-full" />
    </div>
  );
}
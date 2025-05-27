"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";

type DailyData = { _id: string; revenue?: number; count?: number };
type Props = {
  dayByRevenue: DailyData[];
  dailyUserRegistrations: DailyData[];
};

export function Component({ dayByRevenue = [], dailyUserRegistrations = [] }: Props) {
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

export default Component;

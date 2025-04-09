'use client'

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { ChartConfig } from "@/components/ui/chart"

type DailyData = {
  _id: string // date string "YYYY-MM-DD"
  revenue?: number
  count?: number
}

type Props = {
  dayByRevenue: DailyData[]
  dailyUserRegistrations: DailyData[]
}

const chartConfig: ChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  users: {
    label: "User Signups",
    color: "hsl(var(--chart-2))",
  },
}

export function Component({
  dayByRevenue,
  dailyUserRegistrations,
}: Props) {
  // 🧠 Merge both datasets into one by date
  const mergedData = Array.from(
    new Set([
      ...dayByRevenue.map((d) => d._id),
      ...dailyUserRegistrations.map((d) => d._id),
    ])
  )
    .sort()
    .map((date) => {
      const revenueEntry = dayByRevenue.find((d) => d._id === date)
      const userEntry = dailyUserRegistrations.find((d) => d._id === date)

      return {
        date,
        revenue: revenueEntry?.revenue || 0,
        users: userEntry?.count || 0,
      }
    })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Revenue & Signups</CardTitle>
        <CardDescription>
          Tracking per-day revenue and user registrations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={mergedData}
            margin={{ left: -20, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(5)} // e.g. show "04-09" for "2025-04-09"
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
              type="natural"
              fill="var(--color-revenue)"
              fillOpacity={0.4}
              stroke="var(--color-revenue)"
              stackId="a"
            />
            <Area
              dataKey="users"
              type="natural"
              fill="var(--color-users)"
              fillOpacity={0.4}
              stroke="var(--color-users)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up this week <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Daily stats from {mergedData[0]?.date} to {mergedData.at(-1)?.date}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default Component;

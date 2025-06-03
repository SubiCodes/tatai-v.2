"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A simple area chart"

const chartConfig = {
  users: {
    label: "users",
    color: "#006FFD",
  },
}

export function AreaChartCurved({ data }) {
  return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
              className="bg-white border-0"
            />
            <Area
              dataKey="users"
              type="natural"
              fill="#006FFD"
              fillOpacity={.8}
              stroke="var(--color-desktop)"
            />
          </AreaChart>
        </ChartContainer>

  )
};

export default AreaChartCurved;

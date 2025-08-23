"use client"

import { Area, AreaChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  reports: {
    label: "Reports",
    color: "#006FFD",
  },
}

export function AreaChartCurved({ data }) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
          bottom: 12,
        }}
      >
        {/* ✅ Subtle horizontal grid only */}
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />

        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tickFormatter={(value) => value.slice(0, 3)}
          stroke="#6B7280"
        />

        {/* ✅ Custom Tooltip */}
        <ChartTooltip
          cursor={{ stroke: "#006FFD", strokeWidth: 1, strokeDasharray: "4 4" }}
          content={
            <ChartTooltipContent
              className="rounded-lg shadow-lg border bg-white px-3 py-2 text-sm"
              indicator="dot"
            />
          }
        />

        {/* ✅ Gradient Fill for Area */}
        <defs>
          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#006FFD" stopOpacity={0.7} />
            <stop offset="95%" stopColor="#006FFD" stopOpacity={0.1} />
          </linearGradient>
        </defs>

        <Area
          dataKey="reports"
          type="monotone"
          stroke="#006FFD"
          strokeWidth={3}
          fill="url(#colorUsers)"
          activeDot={{ r: 6, fill: "#0818A8", strokeWidth: 2, stroke: "#fff" }}
        />
      </AreaChart>
    </ChartContainer>
  )
}

export default AreaChartCurved

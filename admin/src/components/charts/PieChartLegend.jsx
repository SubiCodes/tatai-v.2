"use client"

import { Pie, PieChart, Cell } from "recharts"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart"

export const description = "An improved pie chart with legend"

const chartConfig = {
    total: { label: "Total" },
    repair: { label: "Repair Guides", color: "#4B9CD3" },
    tool: { label: "Tool Guides", color: "#007FFD" }, // your secondary
    diy: { label: "DIY Guides", color: "#0818A8" },  // your primary
}

export function PieChartLegend({ data }) {
    return (
        <ChartContainer config={chartConfig} className="min-h-[280px] w-full">
            <PieChart>
                {/* ✅ Modern Tooltip */}
                <ChartTooltip
                    content={
                        <ChartTooltipContent
                            className="rounded-lg shadow-md border bg-white px-3 py-2 text-sm"
                            hideLabel={false}
                            formatter={(value, name) => [
                                `${value.toLocaleString()}     `, // e.g. "1,234 guides"
                                chartConfig[name]?.label || name,
                            ]}
                        />
                    }
                />

                {/* ✅ Pie with custom colors + nice outer labels */}
                <Pie
                    data={data}
                    dataKey="total"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={50}
                    paddingAngle={4}
                    labelLine={false}
                    label={({ percent }) =>
                        `${(percent * 100).toFixed(0)} %` // <-- Added space before %
                    }
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={chartConfig[entry.type]?.color || "#ccc"}
                            stroke="#fff"
                            strokeWidth={2}
                            className="hover:opacity-80 transition-all"
                        />
                    ))}
                </Pie>

                {/* ✅ Styled Legend */}
                <ChartLegend
                    content={
                        <ChartLegendContent
                            nameKey="type"
                            className="flex flex-wrap justify-center gap-3 mt-4 text-sm font-medium"
                            formatter={(value) => chartConfig[value]?.label || value}
                        />
                    }
                />
            </PieChart>
        </ChartContainer>
    )
}

export default PieChartLegend

"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

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
    ChartLegend,
    ChartLegendContent
} from "@/components/ui/chart"

export const description = "A pie chart with a label"

const chartConfig = {
    total: {
        label: "Total",
    },
    repair: {
        label: "Repair Guides",
        color: "#4B9CD3",
    },
    tool: {
        label: "Tool Guides",
        color: "#007FFF",
    },
    diy: {
        label: "DIY Guides",
        color: "#1877F2",
    },
}

export function PieChartLegend({ data }) {
    return (
        <ChartContainer
            config={chartConfig}
            className="min-h-[200px] w-full"
        >
            <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} className="bg-white border-0" />
                <Pie data={data} dataKey="total" label nameKey="type" />
                <ChartLegend
                    content={<ChartLegendContent nameKey="type" />}
                    className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                />
            </PieChart>
        </ChartContainer>
    )
}

export default PieChartLegend

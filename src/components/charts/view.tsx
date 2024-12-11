"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { category: "Total Members", value: 275, fill: "var(--color-members)" },
  { category: "Membership Earnings", value: 200, fill: "var(--color-earnings)" },
  { category: "Product & Services", value: 187, fill: "var(--color-services)" },
];

const chartConfig = {
  value: {
    label: "Value",
  },
  members: {
    label: "Total Members",
    color: "hsl(var(--chart-1))",
  },
  earnings: {
    label: "Membership Earnings",
    color: "hsl(var(--chart-2))",
  },
  services: {
    label: "Product & Services",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function Views() {
  return (
    <Card className="w-full mx-auto max-w-8xl">  
      <CardHeader>
        <CardTitle>Bar Chart - Mixed</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <ChartContainer config={chartConfig}>
          <BarChart
            width={1000}  
            height={100}  
            data={chartData}
            layout="vertical"
            margin={{
              left: 10,
            }}
          >
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="value" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="value" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing data for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}

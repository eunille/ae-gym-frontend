import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import React, { useEffect, useState } from "react";
import axios from "axios";

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

const chartConfig = {
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
  const [chartData, setChartData] = useState([
    { category: "Total Members", value: 0, fill: "var(--color-members)" },
    { category: "Membership Earnings", value: 0, fill: "var(--color-earnings)" },
    { category: "Product & Services", value: 0, fill: "var(--color-services)" },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState<"day" | "week" | "month">("day");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        const periodMap = {
          day: "day",
          week: "week",
          month: "month",
        };

        const period = periodMap[selectedPeriod as keyof typeof periodMap] || "day";
        const membersResponse = await axios.get(
          `http://127.0.0.1:8000/api/analytics/members/${period}/`
        );
        const earningsResponse = await axios.get(
          `http://127.0.0.1:8000/api/analytics/membership-earnings/${period}/`
        );
        const productResponse = await axios.get(
          `http://127.0.0.1:8000/api/analytics/product-earnings/${period}/`
        );

        setChartData([
          { category: "Total Members", value: membersResponse.data.members, fill: "var(--color-members)" },
          { category: "Membership Earnings", value: earningsResponse.data.membership_earning, fill: "var(--color-earnings)" },
          { category: "Product & Services", value: productResponse.data.product_earning, fill: "var(--color-services)" },
        ]);
      } catch (err) {
       
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedPeriod]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card className="w-full mx-auto max-w-8xl">
      <CardHeader>
        <CardTitle>Bar Chart - Mixed</CardTitle>
        <CardDescription>Data for the selected period</CardDescription>
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setSelectedPeriod("day")}
            className={`px-4 py-2 rounded ${selectedPeriod === "day" ? "bg-black text-white" : "bg-gray-200"}`}
          >
            Day
          </button>
          <button
            onClick={() => setSelectedPeriod("week")}
            className={`px-4 py-2 rounded ${selectedPeriod === "week" ? "bg-black text-white" : "bg-gray-200"}`}
          >
            Week
          </button>
          <button
            onClick={() => setSelectedPeriod("month")}
            className={`px-4 py-2 rounded ${selectedPeriod === "month" ? "bg-black text-white" : "bg-gray-200"}`}
          >
            Month
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <ChartContainer config={chartConfig}>
          <BarChart
            width={1000}
            height={100}
            data={chartData}
            layout="vertical"
            margin={{
              left: 30,
            }}
          >
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                
                switch (value) {
                  case "Total Members":
                    return chartConfig.members.label;
                  case "Membership Earnings":
                    return chartConfig.earnings.label;
                  case "Product & Services":
                    return chartConfig.services.label;
                  default:
                    return value;
                }
              }}
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
     
      </CardFooter>
    </Card>
  );
}

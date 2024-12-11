import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import React, { useEffect, useState } from "react";
import axios from "axios";
import TotalCards from "@/components/charts/TotalCards";

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
  const [chartData, setChartData] = useState([
    { category: "Total Members", value: 0, fill: "var(--color-members)" },
    { category: "Membership Earnings", value: 0, fill: "var(--color-earnings)" },
    { category: "Product & Services", value: 0, fill: "var(--color-services)" },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        const membersResponse = await axios.get("http://127.0.0.1:8000/api/analytics/members/day/");
        const earningsResponse = await axios.get(
          "http://127.0.0.1:8000/api/analytics/membership-earnings/day/"
        );
        const productResponse = await axios.get(
          "http://127.0.0.1:8000/api/analytics/product-earnings/day/"
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
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card className="w-full mx-auto max-w-8xl">
      <CardHeader>
        <CardTitle>Bar Chart - Mixed</CardTitle>
        <CardDescription>Data for Today</CardDescription>
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
              tickFormatter={(value: keyof typeof chartConfig) => {
                const category = chartData.find((item) => item.category === value);
                return category ? chartConfig[value]?.label : value;
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

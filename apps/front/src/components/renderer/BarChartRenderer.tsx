"use client";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const BarChartRenderer = ({
  chartConfig,
  chartData,
}: {
  chartConfig: ChartConfig;
  chartData: Record<string, string | number>[];
}) => {
  return (
    <ChartContainer config={chartConfig} className="max-h-[20rem] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />
        <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
        <Bar dataKey="revenues" fill="var(--color-revenues)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
};

export default BarChartRenderer;

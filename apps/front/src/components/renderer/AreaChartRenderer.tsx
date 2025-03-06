"use client";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrency } from "@/utils/format";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";

const AreaChartRenderer = ({
  chartConfig,
  chartData,
  dataKey,
  axisDataKey,
}: {
  chartConfig: ChartConfig;
  chartData: { [key: string]: number | string }[];
  dataKey: string;
  axisDataKey: string;
}) => {
  return (
    <ChartContainer config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={axisDataKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent indicator="dot" formatter={tooltipFormatter} />
          }
        />
        <Area
          dataKey={dataKey}
          type="natural"
          fill="#2662D9"
          fillOpacity={0.4}
          stroke="#2662D9"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
};

export default AreaChartRenderer;

const tooltipFormatter = (value: ValueType) => {
  return (
    <div className="flex gap-x-2 items-center">
      <div className="h-2.5 w-2.5 bg-[#2662D9] rounded-[2px]" />
      <span>{formatCurrency(value as number)}</span>
    </div>
  );
};

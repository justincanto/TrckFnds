"use client";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrency } from "@/utils/format";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

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
          top: 24,
        }}
      >
        <CartesianGrid vertical={false} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <XAxis
          dataKey={axisDataKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              indicator="dot"
              formatter={(value, dataKey) => tooltipFormatter(value, dataKey)}
            />
          }
        />
        <Area
          dataKey={dataKey}
          type="natural"
          fill={`var(--color-${dataKey})`}
          fillOpacity={0.4}
          stroke={`var(--color-${dataKey})`}
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
};

export default AreaChartRenderer;

const tooltipFormatter = (value: ValueType, dataKey: NameType) => {
  return (
    <div className="flex gap-x-2 items-center">
      <div className={`h-2.5 w-2.5 bg-[--color-${dataKey}] rounded-[2px]`} />
      <span>{formatCurrency(value as number)}</span>
    </div>
  );
};

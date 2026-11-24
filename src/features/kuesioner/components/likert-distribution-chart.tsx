"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";

type LikertDistribution = {
  scale: string;
  totalJawaban: number;
};

interface LikertDistributionChartProps {
  data: LikertDistribution[];
}

const chartConfig = {
  totalJawaban: {
    label: "Total Jawaban",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export function LikertDistributionChart({ data }: LikertDistributionChartProps) {
  return (
    <ChartContainer config={chartConfig} className="max-h-[250px]">
      <BarChart accessibilityLayer data={data} margin={{ top: 24 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="scale" tickLine={false} tickMargin={10} axisLine={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" hideLabel />} />
        <Bar dataKey="totalJawaban" fill="var(--color-totalJawaban)" radius={6}>
          <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

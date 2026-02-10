'use client';

import React from 'react';
import type { ButtonProps, CardProps } from '@heroui/react';
import { cn } from '@heroui/react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

type ChartData = {
  name: string;
  [key: string]: string | number;
};

export type CircleChartProps = {
  title: string;
  color: ButtonProps['color'];
  categories: string[];
  chartData: ChartData[];
};

const formatTotal = (total: number) => (total >= 1000 ? `${(total / 1000).toFixed(1)}K` : total);

export const CircleChartCard = React.forwardRef<
  HTMLDivElement,
  Omit<CardProps, 'children'> & CircleChartProps
>(({ className, title, categories, color, chartData }, ref) => (
  <div ref={ref} className={cn('dark:border-default-100 border border-transparent', className)}>
    <div className="flex h-full flex-col flex-wrap items-center justify-center gap-x-2 lg:flex-nowrap">
      <ResponsiveContainer
        className="[&_.recharts-surface]:outline-hidden"
        height={200}
        width="100%"
      >
        <PieChart
          accessibilityLayer
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          title={title}
        >
          <Tooltip
            content={({ label, payload }) => (
              <div className="rounded-medium bg-background text-tiny shadow-small flex h-8 min-w-[120px] items-center gap-x-2 px-1">
                <span className="text-foreground font-medium">{label}</span>
                {payload?.map((p, index) => {
                  const { name } = p;
                  const { value } = p;
                  const category = categories.find((c) => c.toLowerCase() === name) ?? name;

                  return (
                    <div key={`${index}-${name}`} className="flex w-full items-center gap-x-2">
                      <div
                        className="h-2 w-2 flex-none rounded-full"
                        style={{
                          backgroundColor: `hsl(var(--heroui-${color}-${(index + 1) * 200}))`,
                        }}
                      />
                      <div className="text-tiny text-default-700 flex w-full items-center justify-between gap-x-2 pr-1">
                        <span className="text-default-500">{category}</span>
                        <span className="text-default-700 font-mono font-medium">
                          {formatTotal(value as number)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            cursor={false}
          />
          <Pie
            animationDuration={1000}
            animationEasing="ease"
            data={chartData}
            dataKey="value"
            innerRadius="68%"
            nameKey="name"
            paddingAngle={-20}
            strokeWidth={0}
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`hsl(var(--heroui-${color}-${(index + 1) * 200}))`}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="text-tiny text-default-500 flex w-full justify-center gap-4 p-4 lg:p-0">
        {categories.map((category, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: `hsl(var(--heroui-${color}-${(index + 1) * 200}))`,
              }}
            />
            <span className="capitalize">{category}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
));

CircleChartCard.displayName = 'CircleChartCard';

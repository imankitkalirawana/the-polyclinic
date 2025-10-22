'use client';

import {
  CardProps,
  Card,
  cn,
  Select,
  SelectItem,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import React from 'react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { BarChartProps } from './data';

const formatWeekday = (weekday: string) => {
  const day =
    {
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
      Sun: 0,
    }[weekday] ?? 0;

  return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date(2024, 0, day));
};

const AppointmentByTypes = React.forwardRef<
  HTMLDivElement,
  Omit<CardProps, 'children'> & BarChartProps
>(({ className, title, value, unit, categories, color, chartData, ...props }, ref) => {
  return (
    <Card
      ref={ref}
      className={cn('h-[300px] border border-transparent dark:border-default-100', className)}
      {...props}
    >
      <div className="flex flex-col gap-y-2 p-4">
        <div className="flex items-center justify-between gap-x-2">
          <dt>
            <h3 className="font-medium text-default-500 text-small">{title}</h3>
          </dt>
          <div className="flex items-center justify-end gap-x-2">
            <Select
              aria-label="Time Range"
              classNames={{
                trigger: 'min-w-[100px] min-h-7 h-7',
                value: 'text-tiny text-default-500!',
                selectorIcon: 'text-default-500',
                popoverContent: 'min-w-[120px]',
              }}
              defaultSelectedKeys={['per-day']}
              listboxProps={{
                itemClasses: {
                  title: 'text-tiny',
                },
              }}
              placeholder="Per Day"
              size="sm"
            >
              <SelectItem key="per-day">Per Day</SelectItem>
              <SelectItem key="per-week">Per Week</SelectItem>
              <SelectItem key="per-month">Per Month</SelectItem>
            </Select>
            <Dropdown
              classNames={{
                content: 'min-w-[120px]',
              }}
              placement="bottom-end"
            >
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <Icon height={16} icon="solar:menu-dots-bold" width={16} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                itemClasses={{
                  title: 'text-tiny',
                }}
                variant="flat"
              >
                <DropdownItem key="view-details">View Details</DropdownItem>
                <DropdownItem key="export-data">Export Data</DropdownItem>
                <DropdownItem key="set-alert">Set Alert</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <dd className="flex items-baseline gap-x-1">
          <span className="text-3xl font-semibold text-default-900">{value}</span>
          <span className="font-medium text-default-500 text-medium">{unit}</span>
        </dd>
      </div>

      <ResponsiveContainer
        className="[&_.recharts-surface]:outline-hidden"
        height="100%"
        width="100%"
      >
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{
            top: 20,
            right: 14,
            left: -8,
            bottom: 5,
          }}
        >
          <XAxis
            dataKey="weekday"
            style={{ fontSize: 'var(--heroui-font-size-tiny)' }}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            style={{ fontSize: 'var(--heroui-font-size-tiny)' }}
            tickLine={false}
          />
          <Tooltip
            content={({ label, payload }) => (
              <div className="flex h-auto min-w-[120px] items-center gap-x-2 rounded-medium bg-background p-2 shadow-small text-tiny">
                <div className="flex w-full flex-col gap-y-1">
                  <span className="font-medium text-foreground">{formatWeekday(label)}</span>
                  {payload?.map((p, index) => {
                    const name = p.name;
                    const value = p.value;
                    const category = categories.find((c) => c.toLowerCase() === name) ?? name;

                    return (
                      <div key={`${index}-${name}`} className="flex w-full items-center gap-x-2">
                        <div
                          className="h-2 w-2 flex-none rounded-full"
                          style={{
                            backgroundColor: `hsl(var(--heroui-${color}-${(index + 1) * 200}))`,
                          }}
                        />
                        <div className="flex w-full items-center justify-between gap-x-2 pr-1 text-xs text-default-700">
                          <span className="text-default-500">{category}</span>
                          <span className="font-mono font-medium text-default-700">{value}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            cursor={false}
          />
          {categories.map((category, index) => (
            <Bar
              key={`${category}-${index}`}
              animationDuration={450}
              animationEasing="ease"
              barSize={24}
              dataKey={category}
              fill={`hsl(var(--heroui-${color}-${(index + 1) * 200}))`}
              radius={index === categories.length - 1 ? [4, 4, 0, 0] : 0}
              stackId="bars"
            />
          ))}
        </BarChart>
      </ResponsiveContainer>

      <div className="flex w-full justify-center gap-4 pb-4 text-default-500 text-tiny">
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
    </Card>
  );
});

AppointmentByTypes.displayName = 'AppointmentByTypes';

export default AppointmentByTypes;

'use client';

import { Button, Select, SelectItem } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  format,
  addMonths,
  subMonths,
  addYears,
  subYears,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
} from 'date-fns';

interface CalendarHeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  view: 'month' | 'week' | 'day' | 'schedule' | 'year';
  onViewChange: (view: 'month' | 'week' | 'day' | 'schedule' | 'year') => void;
}

const views = [
  { label: 'Schedule', value: 'schedule' },
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' },
];

export function CalendarHeader({
  currentDate,
  onDateChange,
  view,
  onViewChange,
}: CalendarHeaderProps) {
  const navigatePrevious = () => {
    switch (view) {
      case 'month':
        onDateChange(subMonths(currentDate, 1));
        break;
      case 'week':
        onDateChange(subWeeks(currentDate, 1));
        break;
      case 'day':
        onDateChange(subDays(currentDate, 1));
        break;
      case 'year':
        onDateChange(subYears(currentDate, 1));
        break;
      case 'schedule':
        onDateChange(subMonths(currentDate, 1));
        break;
    }
  };

  const navigateNext = () => {
    switch (view) {
      case 'month':
        onDateChange(addMonths(currentDate, 1));
        break;
      case 'week':
        onDateChange(addWeeks(currentDate, 1));
        break;
      case 'day':
        onDateChange(addDays(currentDate, 1));
        break;
      case 'year':
        onDateChange(addYears(currentDate, 1));
        break;
      case 'schedule':
        onDateChange(addMonths(currentDate, 1));
        break;
    }
  };

  const getDateTitle = () => {
    switch (view) {
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      case 'week':
        return format(currentDate, 'MMMM yyyy');
      case 'day':
        return format(currentDate, 'MMMM d, yyyy');
      case 'year':
        return format(currentDate, 'yyyy');
      case 'schedule':
        return format(currentDate, 'MMMM yyyy');
      default:
        return '';
    }
  };

  return (
    <header className="flex items-center justify-between border-b bg-background p-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <span className="text-lg font-semibold text-white">C</span>
          </div>
          <h1 className="text-xl font-semibold">Calendar</h1>
        </div>

        <Button
          variant="bordered"
          onPress={() => onDateChange(new Date())}
          className="px-4"
        >
          Today
        </Button>

        <div className="flex items-center gap-1">
          <Button variant="ghost" isIconOnly onPress={navigatePrevious}>
            <Icon icon="mdi:chevron-left" className="h-4 w-4" />
          </Button>
          <Button variant="ghost" isIconOnly onPress={navigateNext}>
            <Icon icon="mdi:chevron-right" className="h-4 w-4" />
          </Button>
        </div>

        <h2 className="min-w-[200px] text-xl font-medium">{getDateTitle()}</h2>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" isIconOnly>
          <Icon icon="mdi:search" className="h-4 w-4" />
        </Button>
        <Button variant="ghost" isIconOnly>
          <Icon icon="mdi:settings" className="h-4 w-4" />
        </Button>
        <Select
          selectedKeys={[view]}
          defaultSelectedKeys={[view]}
          disallowEmptySelection
          onSelectionChange={(value: any) => onViewChange(value)}
          className="w-full max-w-56"
          items={views}
        >
          {(item) => (
            <SelectItem key={item.value} textValue={item.value}>
              {item.label}
            </SelectItem>
          )}
        </Select>
        <Button className="gap-2">
          <Icon icon="mdi:plus" className="h-4 w-4" />
          Create
        </Button>
      </div>
    </header>
  );
}

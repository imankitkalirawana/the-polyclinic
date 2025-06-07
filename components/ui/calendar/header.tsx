'use client';

import { Button, Kbd, Select, SelectItem } from '@heroui/react';
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
import { useCalendar, View } from './store';

interface CalendarHeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

const views = [
  { label: 'Schedule', value: 'schedule', shortcut: 's' },
  { label: 'Day', value: 'day', shortcut: 'd' },
  { label: 'Week', value: 'week', shortcut: 'w' },
  { label: 'Month', value: 'month', shortcut: 'm' },
  { label: 'Year', value: 'year', shortcut: 'y' },
];

export function CalendarHeader({
  currentDate,
  onDateChange,
}: CalendarHeaderProps) {
  const { view, setView } = useCalendar();
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
    <header className="flex items-center justify-between border-b p-4">
      <div className="flex items-center gap-4">
        <Button
          variant="bordered"
          onPress={() => onDateChange(new Date())}
          className="px-4"
        >
          Today
        </Button>

        <div className="flex items-center gap-1">
          <Button
            variant="light"
            size="sm"
            isIconOnly
            radius="full"
            onPress={navigatePrevious}
          >
            <Icon
              icon="solar:alt-arrow-left-line-duotone"
              className="h-4 w-4"
            />
          </Button>
          <Button
            variant="light"
            size="sm"
            isIconOnly
            radius="full"
            onPress={navigateNext}
          >
            <Icon
              icon="solar:alt-arrow-right-line-duotone"
              className="h-4 w-4"
            />
          </Button>
        </div>

        <h2 className="whitespace-nowrap text-lg font-medium">
          {getDateTitle()}
        </h2>
      </div>

      <div className="flex w-full items-center justify-end gap-2">
        <Button variant="light" radius="full" isIconOnly>
          <Icon icon="fluent:search-24-regular" width={20} />
        </Button>
        <Button variant="light" isIconOnly radius="full">
          <Icon icon="solar:settings-linear" strokeWidth={2} width={20} />
        </Button>
        <Select
          aria-label="View"
          selectedKeys={[view]}
          defaultSelectedKeys={[view]}
          disallowEmptySelection
          onChange={(e) => setView(e.target.value as View)}
          className="max-w-36"
          items={views}
        >
          {(item) => (
            <SelectItem
              key={item.value}
              textValue={
                item.value.charAt(0).toUpperCase() + item.value.slice(1)
              }
              endContent={<Kbd className="capitalize">{item.shortcut}</Kbd>}
            >
              {item.label}
            </SelectItem>
          )}
        </Select>
        <Button
          className="gap-2"
          startContent={<Icon icon="mdi:plus" className="h-4 w-4" />}
        >
          Create
        </Button>
      </div>
    </header>
  );
}

'use client';

import React from 'react';
import { useSession } from '@/libs/providers/session-provider';
import { Button, ButtonGroup, Kbd, Select, SelectItem, Tooltip } from '@heroui/react';
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  format,
  isToday,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns';
import { parseAsStringEnum, useQueryState } from 'nuqs';
import { Icon } from '@iconify/react/dist/iconify.js';

import { allowedRolesToCreateAppointment } from './data';
import { ViewType, viewTypes as ViewTypes } from './types';
import { useKeyPress } from '@/hooks/useKeyPress';
import { UserRole } from '@repo/store';

interface CalendarHeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onToday: () => void;
  onCreateAppointment: () => void;
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
  onToday,
  onDateChange,
  onCreateAppointment,
}: CalendarHeaderProps) {
  const { user } = useSession();
  const [view, setView] = useQueryState(
    'type',
    parseAsStringEnum(ViewTypes).withDefault('schedule')
  );

  useKeyPress(['m'], () => {
    setView('month');
  });
  useKeyPress(['y'], () => {
    setView('year');
  });
  useKeyPress(['w'], () => {
    setView('week');
  });
  useKeyPress(['d'], () => {
    setView('day');
  });
  useKeyPress(['s'], () => {
    setView('schedule');
  });
  useKeyPress(['t'], () => {
    onToday();
  });

  useKeyPress(['ArrowRight'], () => {
    navigateNext();
  });
  useKeyPress(['ArrowLeft'], () => {
    navigatePrevious();
  });

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
    <header className="border-divider flex items-center justify-between border-b px-2 py-2 sm:px-4">
      <div className="flex items-center sm:gap-4">
        <Button
          variant="flat"
          color={isToday(currentDate) ? 'primary' : 'default'}
          onPress={() => onDateChange(new Date())}
          className="px-2"
          size="sm"
        >
          Today
        </Button>

        <div className="flex items-center gap-1">
          <Button variant="light" size="sm" isIconOnly radius="full" onPress={navigatePrevious}>
            <Icon icon="solar:alt-arrow-left-line-duotone" className="h-4 w-4" />
          </Button>
          <Button variant="light" size="sm" isIconOnly radius="full" onPress={navigateNext}>
            <Icon icon="solar:alt-arrow-right-line-duotone" className="h-4 w-4" />
          </Button>
        </div>

        <h2 className="font-medium whitespace-nowrap">{getDateTitle()}</h2>
      </div>

      <div className="flex w-full items-center justify-end gap-2">
        <Button variant="light" radius="full" isIconOnly size="sm">
          <Icon icon="fluent:search-24-regular" width={18} />
        </Button>
        <Button variant="light" isIconOnly radius="full" size="sm">
          <Icon icon="solar:settings-linear" strokeWidth={2} width={18} />
        </Button>
        <Select
          aria-label="View"
          selectedKeys={[view || '']}
          defaultSelectedKeys={[view || '']}
          disallowEmptySelection
          onChange={(e) => setView(e.target.value as ViewType)}
          className="max-w-36"
          items={views}
          size="sm"
        >
          {(item) => (
            <SelectItem
              key={item.value}
              textValue={item.value.charAt(0).toUpperCase() + item.value.slice(1)}
              endContent={<Kbd className="capitalize">{item.shortcut}</Kbd>}
            >
              {item.label}
            </SelectItem>
          )}
        </Select>
        {allowedRolesToCreateAppointment.includes(user?.role || UserRole.PATIENT) && (
          <ButtonGroup size="sm">
            <Button
              color="primary"
              startContent={<Icon icon="solar:add-circle-bold-duotone" className="h-4 w-4" />}
              onPress={onCreateAppointment}
            >
              Book Appointment
            </Button>
            {user?.role === UserRole.PATIENT && (
              <Tooltip
                content="Book an appointment with AI"
                className="bg-linear-to-br from-blue-300/50 via-blue-500/50 via-40% to-purple-500/50 backdrop-blur-xs"
              >
                <Button
                  isIconOnly
                  radius="full"
                  className="bg-linear-to-br from-blue-300/50 via-blue-500/50 via-40% to-purple-500/50"
                >
                  <Icon icon="solar:stars-minimalistic-line-duotone" className="h-4 w-4" />
                </Button>
              </Tooltip>
            )}
          </ButtonGroup>
        )}
      </div>
    </header>
  );
}

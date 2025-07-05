'use client';

import type { CalendarBookingStepType } from './types';

import { Calendar, cn, Skeleton } from '@heroui/react';
import React, { useState } from 'react';
import {
  CalendarDate,
  getLocalTimeZone,
  isWeekend,
  today,
} from '@internationalized/date';

import { type TimeSlot } from './util';
import CalendarBookingConfirmation from './booking-confirmation';

const LoadingSkeleton = () => (
  <div
    className={
      'flex w-[393px] flex-col items-center gap-5 rounded-large bg-default-50 shadow-small lg:w-fit lg:flex-row lg:items-start lg:px-6'
    }
  >
    <div className={'w-full px-6 lg:w-[372px] lg:px-0'}>
      <div className={'flex items-center justify-center py-3'}>
        <Skeleton className={'h-[9px] w-[98px] rounded-full'} />
      </div>
      <div className={'grid grid-cols-4 gap-4'}>
        <Skeleton className={'h-2.5 rounded-full'} />
        <Skeleton className={'h-2.5 rounded-full'} />
        <Skeleton className={'h-2.5 rounded-full'} />
        <Skeleton className={'h-2.5 rounded-full'} />
      </div>
      <div className={'mt-8 grid grid-cols-7 gap-5'}>
        {Array.from({ length: 35 }).map((_, i) => {
          return (
            <Skeleton
              key={i}
              className={cn('size-[29px] rounded-full', {
                'opacity-0': i === 0 || i === 1 || i === 33 || i === 34,
              })}
            />
          );
        })}
      </div>
    </div>
    <div className={'w-full gap-2 px-6 pb-6 lg:w-[220px] lg:p-0'}>
      <div className={'flex items-center justify-between py-2'}>
        <Skeleton className={'h-[15px] w-[100px] rounded-full'} />
        <Skeleton className={'h-[27px] w-[67px] rounded-full'} />
      </div>
      <div className={'mt-2 space-y-2'}>
        <Skeleton className={'h-10 w-full rounded-full'} />
        <Skeleton className={'h-10 w-full rounded-full'} />
        <Skeleton className={'h-10 w-full rounded-full'} />
        <Skeleton className={'h-10 w-full rounded-full'} />
      </div>
    </div>
  </div>
);

interface CalendarBookingProps {
  date: CalendarDate;
  onDateChange: (date: CalendarDate) => void;
  onSubmit: () => void;
}

export default function CalendarBooking({
  date = today(getLocalTimeZone()),
  onDateChange,
  onSubmit,
}: CalendarBookingProps) {
  const [calendarBookingStep, setCalendarBookingStep] =
    useState<CalendarBookingStepType>('booking_initial');

  const [selectedDate, setSelectedDate] = React.useState<CalendarDate>(date);
  const [selectedTimeSlotRange, setSelectedTimeSlotRange] = useState<
    TimeSlot[]
  >([]);
  const [selectedTime, setSelectedTime] = useState<string>('');

  const onTimeChange = (time: string, selectedTimeSlotRange?: TimeSlot[]) => {
    if (selectedTimeSlotRange) setSelectedTimeSlotRange(selectedTimeSlotRange);
    setSelectedTime(time);
  };

  const isDateUnavailable = (date: CalendarDate) => {
    return isWeekend(date, 'en-US');
  };

  if (calendarBookingStep === 'booking_confirmation') {
    return <CalendarBookingConfirmation />;
  }

  return (
    <div className="flex justify-center">
      <Calendar
        calendarWidth="372px"
        className="rounded-r-none shadow-none"
        classNames={{
          headerWrapper: 'bg-transparent px-3 pt-1.5 pb-3',
          title: 'text-default-700 text-small font-semibold',
          gridHeader: 'bg-transparent shadow-none',
          gridHeaderCell: 'font-medium text-default-400 text-xs p-0 w-full',
          gridHeaderRow: 'px-3 pb-3',
          gridBodyRow: 'gap-x-1 px-3 mb-1 first:mt-4 last:mb-0',
          gridWrapper: 'pb-3',
          cell: 'p-1.5 w-full',
          cellButton:
            'w-full h-9 rounded-medium data-[selected]:shadow-[0_2px_12px_0] data-[selected]:shadow-primary-300 text-small font-medium',
        }}
        showHelper
        isDateUnavailable={(date) => isWeekend(date, 'en-US')}
        // @ts-ignore
        value={date}
        weekdayStyle="short"
        onChange={onDateChange}
      />
      {/* <CalendarTimeSelect
        day={selectedDate.day}
        duration={DurationEnum.FifteenMinutes}
        selectedTime={selectedTime}
        weekday={format(selectedDate.toString(), 'EEE', { locale: enUS })}
        onConfirm={onSubmit}
        onTimeChange={onTimeChange}
      /> */}
    </div>
  );
}

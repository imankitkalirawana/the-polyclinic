'use client';

import { Button } from '@nextui-org/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { DateValue } from '@react-aria/calendar';
import { useLocale } from '@react-aria/i18n';
import { useEffect, useState } from 'react';
import { availableTimes } from './available-times';
import { ScrollShadow } from '@nextui-org/react';
import Skeleton from '@/components/ui/skeleton';
import { useQueryState } from 'nuqs';
import { format } from 'date-fns';

export function RightPanel({
  date,
  timeZone,
  weeksInMonth,
  handleChangeAvailableTime
}: {
  date: DateValue;
  timeZone: string;
  weeksInMonth: number;
  handleChangeAvailableTime: (time: string) => void;
}) {
  const { locale } = useLocale();

  const [dayInfo, setDayInfo] = useState<{
    dayName: string;
    dayNumber: string;
  }>({ dayName: '', dayNumber: '' });

  useEffect(() => {
    const [dayNumber, dayName] = date
      .toDate(timeZone)
      .toLocaleDateString(locale, {
        weekday: 'short',
        day: 'numeric'
      })
      .split(' ');
    setDayInfo({ dayName, dayNumber });
  }, [date, locale, timeZone]);

  return (
    <Tabs
      defaultValue="12"
      className="ml-4 mt-4 flex w-full max-w-md flex-col gap-4 border-t pt-6 sm:border-t-0 lg:mt-0 lg:w-[280px] lg:border-l lg:pl-6 lg:pt-0"
    >
      <div className="flex items-center justify-between">
        <div className="align-center text-md text-gray-12 flex-1 font-bold">
          {dayInfo.dayName || <Skeleton className="flex h-6 w-12" />}{' '}
          <span className="text-gray-11">{dayInfo.dayNumber || ''}</span>
        </div>
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger value="12">12h</TabsTrigger>
          <TabsTrigger value="24">24h</TabsTrigger>
        </TabsList>
      </div>
      {['12', '24'].map((time) => (
        <TabsContent key={time} value={time}>
          <ScrollShadow
            className="no-scrollbar h-full"
            style={{
              maxHeight: weeksInMonth > 5 ? '380px' : '320px'
            }}
          >
            <div className="flex gap-2 pr-3 lg:flex-col">
              {availableTimes.map((availableTime) => {
                return (
                  <Button
                    variant="flat"
                    onPress={() => {
                      handleChangeAvailableTime(
                        availableTime[time as '12' | '24']
                      );
                    }}
                    key={availableTime[time as '12' | '24']}
                  >
                    {availableTime[time as '12' | '24']}
                  </Button>
                );
              })}
            </div>
          </ScrollShadow>
        </TabsContent>
      ))}
    </Tabs>
  );
}

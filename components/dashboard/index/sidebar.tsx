'use client';
import { Calendar } from '@heroui/react';
import { getLocalTimeZone, today } from '@internationalized/date';

export default function Sidebar() {
  return (
    <div className="rounded-large bg-default-100 flex h-full w-full max-w-fit flex-col items-center gap-4 p-2">
      <div>
        <Calendar
          isReadOnly
          className="border-none bg-transparent shadow-none"
          classNames={{
            headerWrapper: 'bg-transparent',
            gridHeader: 'bg-transparent shadow-none',
          }}
          showMonthAndYearPickers
          aria-label="Date (Read Only)"
          value={today(getLocalTimeZone())}
        />
      </div>
    </div>
  );
}

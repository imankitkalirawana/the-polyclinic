'use client';
import { Calendar } from '@heroui/react';
import { getLocalTimeZone, today } from '@internationalized/date';

export default function Sidebar() {
  return (
    <aside className="flex w-full max-w-fit flex-col gap-4 rounded-large bg-default-100 p-2">
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
    </aside>
  );
}

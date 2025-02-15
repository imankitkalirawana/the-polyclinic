'use client';

import { format, addDays, subDays } from 'date-fns';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQueryState } from 'nuqs';

export default function DatePicker() {
  const [date, setDate] = useQueryState('date', {
    defaultValue: new Date().toISOString()
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const scrollRef = useRef<HTMLDivElement>(null);

  const dates = Array.from({ length: 61 }, (_, i) => {
    return subDays(addDays(new Date(), 30), 60 - i);
  });

  const currentDateIndex = dates.findIndex(
    (date) => format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  const scrollToCurrentDate = () => {
    if (scrollRef.current) {
      const scrollAmount =
        currentDateIndex * 82 - scrollRef.current.clientWidth / 2 + 36;
      scrollRef.current.scrollLeft = scrollAmount;
    }
  };

  useEffect(() => {
    scrollToCurrentDate();
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          {format(selectedDate, 'MMMM d, yyyy')}
        </h2>
      </div>

      <div className="relative">
        {/* <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-white"
          onClick={() =>
            scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' })
          }
        >
          <ChevronLeft className="h-4 w-4" />
        </Button> */}

        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scroll-smooth px-10 pb-4 scrollbar-hide"
          onLoad={scrollToCurrentDate} // Ensure it scrolls to the correct position on render
        >
          {dates.map((date) => {
            const isSelected =
              format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
            return (
              <button
                key={date.toISOString()}
                onClick={() => {
                  setDate(date.toISOString());
                  setSelectedDate(date);
                }}
                className={`flex min-w-[72px] flex-col items-center rounded-full px-4 py-2 transition-colors ${
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <span className="text-xs font-medium">
                  {format(date, 'EEE').toUpperCase()}
                </span>
                <span className="text-lg">{format(date, 'd')}</span>
              </button>
            );
          })}
        </div>

        {/* <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-white"
          onClick={() =>
            scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' })
          }
        >
          <ChevronRight className="h-4 w-4" />
        </Button> */}
      </div>
    </div>
  );
}

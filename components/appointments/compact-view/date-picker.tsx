'use client';

import { useEffect, useRef } from 'react';
import { addDays, format, subDays } from 'date-fns';
import { useQueryState } from 'nuqs';
import { ScrollShadow, Tab, Tabs } from '@heroui/react';

export default function DatePicker() {
  const [date, setDate] = useQueryState('date', {
    defaultValue: new Date().toISOString().split('T')[0],
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const dates = Array.from({ length: 61 }, (_, i) => {
    return subDays(addDays(new Date(), 30), 60 - i);
  });

  useEffect(() => {
    if (scrollRef.current && tabRefs.current[date]) {
      const tab = tabRefs.current[date];
      const container = scrollRef.current;

      if (tab) {
        const tabRect = tab.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        container.scrollTo({
          left:
            container.scrollLeft +
            tabRect.left -
            containerRect.left -
            container.clientWidth / 2 +
            tabRect.width / 2,
          behavior: 'smooth',
        });
      }
    }
  }, [date]);

  return (
    <div className="mx-auto w-full max-w-3xl p-4">
      <div className="mb-2">
        <h2 className="text-2xl font-semibold text-default-900">
          {format(new Date(date), 'MMMM d, yyyy')}
        </h2>
      </div>
      <ScrollShadow
        as="div"
        ref={scrollRef}
        className="max-w-3xl scrollbar-hide"
        orientation="horizontal"
      >
        <Tabs
          aria-label="Dates"
          selectedKey={date}
          onSelectionChange={(date) => {
            setDate(date?.toString() ?? '');
          }}
          color="primary"
          items={dates}
          classNames={{
            tabList: 'bg-transparent flex whitespace-nowrap',
            tab: 'min-w-[56px] min-h-20 rounded-3xl border border-divider',
            cursor: 'rounded-3xl ring-4 ring-primary',
          }}
        >
          {(date) => {
            const dateKey = date.toISOString().split('T')[0];
            return (
              <Tab
                key={dateKey}
                title={
                  <div
                    ref={(el) => {
                      tabRefs.current[dateKey] = el;
                    }}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-default-400">
                        {format(date, 'cccccc').toUpperCase()}
                      </span>
                      <span className="font-semibold">{format(date, 'd')}</span>
                    </div>
                  </div>
                }
              />
            );
          }}
        </Tabs>
      </ScrollShadow>
    </div>
  );
}

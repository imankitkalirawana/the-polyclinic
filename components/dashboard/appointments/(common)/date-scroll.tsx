import { useEffect, useRef } from 'react';
import { Button, cn, ScrollShadow } from '@heroui/react';
import { addDays, format, startOfDay, isSameDay, isToday, isAfter } from 'date-fns';

const RANGE = 15;

type DateScrollProps = {
  selectedDate?: Date | null;
  setSelectedDate?: (date: Date) => void;
  hidePastDates?: boolean;
};

export default function DateScroll({
  selectedDate,
  setSelectedDate,
  hidePastDates = false,
}: DateScrollProps) {
  const today = startOfDay(new Date());
  const normalizedSelectedDate = selectedDate ? startOfDay(selectedDate) : today;

  let dates = Array.from({ length: RANGE * 2 + 1 }, (_, i) => addDays(today, i - RANGE));

  if (hidePastDates) {
    dates = dates.filter((date) => isAfter(date, today) || isToday(date));
  }

  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    const key = normalizedSelectedDate.toISOString();
    const el = itemRefs.current.get(key);

    if (el) {
      // Find the scrollable container by traversing up the DOM tree
      let scrollContainer: HTMLElement | null = el.parentElement;
      while (scrollContainer) {
        const style = window.getComputedStyle(scrollContainer);
        if (
          scrollContainer.scrollWidth > scrollContainer.clientWidth &&
          (style.overflowX === 'auto' ||
            style.overflowX === 'scroll' ||
            style.overflow === 'auto' ||
            style.overflow === 'scroll')
        ) {
          break;
        }
        scrollContainer = scrollContainer.parentElement;
      }

      if (scrollContainer) {
        const containerRect = scrollContainer.getBoundingClientRect();
        const elementRect = el.getBoundingClientRect();
        const scrollLeft =
          scrollContainer.scrollLeft +
          (elementRect.left - containerRect.left) -
          containerRect.width / 2 +
          elementRect.width / 2;

        scrollContainer.scrollTo({
          left: scrollLeft,
          behavior: 'smooth',
        });
      } else {
        // Fallback to scrollIntoView with options that prevent page scroll
        el.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    }
  }, [normalizedSelectedDate]);

  return (
    <ScrollShadow orientation="horizontal" hideScrollBar className="pb-4">
      <div className="flex flex-row gap-2 px-2 py-2">
        {dates.map((date) => {
          const isSelected = isSameDay(date, normalizedSelectedDate);
          const key = date.toISOString();

          return (
            <Button
              key={key}
              ref={(el: HTMLButtonElement) => {
                if (el) itemRefs.current.set(key, el);
              }}
              variant={isSelected ? 'solid' : isToday(date) ? 'flat' : 'bordered'}
              color={isSelected || isToday(date) ? 'primary' : 'default'}
              className="min-w-[72px] shrink-0 px-3"
              onPress={() => setSelectedDate?.(date)}
              onDoubleClick={() => setSelectedDate?.(today)}
              endContent={
                <div
                  className={cn(
                    'flex flex-col gap-1 text-[10px] font-medium leading-none',
                    isSelected ? 'text-primary-foreground/80' : 'text-default-500'
                  )}
                >
                  <span>{format(date, 'EEE')}</span>
                  <span className="uppercase">{format(date, 'MMM')}</span>
                </div>
              }
            >
              <h4 className="font-semibold">{format(date, 'dd')}</h4>
            </Button>
          );
        })}
      </div>
    </ScrollShadow>
  );
}

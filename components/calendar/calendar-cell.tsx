import { cn } from '@/lib/utils';
import {
  type CalendarDate,
  getLocalTimeZone,
  isSameMonth,
  isToday
} from '@internationalized/date';
import { useCalendarCell } from '@react-aria/calendar';
import { useFocusRing } from '@react-aria/focus';
import { mergeProps } from '@react-aria/utils';
import type { CalendarState } from '@react-stately/calendar';
import { useRef } from 'react';

export function CalendarCell({
  state,
  date,
  currentMonth
}: {
  state: CalendarState;
  date: CalendarDate;
  currentMonth: CalendarDate;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { cellProps, buttonProps, isSelected, isDisabled, formattedDate } =
    useCalendarCell({ date }, state, ref);

  const isOutsideMonth = !isSameMonth(currentMonth, date);

  const isDateToday = isToday(date, getLocalTimeZone());

  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <td
      {...cellProps}
      className={cn('relative px-0.5 py-0.5', isFocusVisible ? 'z-10' : 'z-0')}
    >
      <div
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        hidden={isOutsideMonth}
        className="xs:size-14 group aspect-square size-10 rounded-md outline-none"
      >
        <div
          className={cn(
            'flex size-full items-center justify-center rounded-md',
            'text-sm font-semibold text-default-500',
            isDisabled
              ? isDateToday
                ? 'cursor-default'
                : 'cursor-default text-default-800'
              : 'cursor-pointer bg-default-100',
            // Focus ring, visible while the cell has keyboard focus.
            isFocusVisible &&
              'ring-1 ring-default-500 ring-offset-1 group-focus:z-10',
            // Darker selection background for the start and end.
            isSelected && 'bg-primary-100 text-default-500',
            // Hover state for non-selected cells.
            !isSelected && !isDisabled && 'hover:ring-2 hover:ring-primary'
            // isDateToday && "bg-gray-1 text-primary ring-0 ring-offset-0",
          )}
        >
          {formattedDate}
          {isDateToday && (
            <div
              className={cn(
                'absolute bottom-2 left-1/2 size-1 -translate-x-1/2 translate-y-1/2 transform rounded-full bg-default-500 sm:bottom-4 sm:size-1.5',
                isSelected && 'bg-primary'
              )}
            />
          )}
        </div>
      </div>
    </td>
  );
}

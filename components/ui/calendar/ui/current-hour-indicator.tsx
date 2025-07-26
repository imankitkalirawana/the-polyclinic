import React from 'react';
import { Tooltip } from '@heroui/react';
import { format } from 'date-fns';

const getCurrentTimePosition = () => {
  const currentTime = new Date();
  const currentMinutes = currentTime.getMinutes();

  const minutePercentage = currentMinutes / 60;

  return minutePercentage;
};

export const CurrentHourIndicator = React.forwardRef<HTMLDivElement, { disableTime?: boolean }>(
  ({ disableTime = false }, ref) => (
    <Tooltip
      isDisabled={disableTime}
      content={format(new Date(), 'HH:mm')}
      className="text-tiny"
      classNames={{
        content: 'bg-red-500 text-white',
        base: 'before:bg-red-600',
      }}
      placement="left"
      showArrow
      delay={1000}
    >
      <div
        ref={ref}
        className="absolute left-0 flex w-[calc(100%+0.5rem)] items-center justify-center"
        style={{
          top: `${getCurrentTimePosition() * 100}%`,
          transform: 'translateY(-50%) translateX(-0.5rem)',
        }}
      >
        <div className="block size-3 rounded-full bg-red-500" />
        <div className="h-[2px] w-full bg-red-500" />
      </div>
    </Tooltip>
  )
);

CurrentHourIndicator.displayName = 'CurrentHourIndicator'; // Avoid anonymous component warning

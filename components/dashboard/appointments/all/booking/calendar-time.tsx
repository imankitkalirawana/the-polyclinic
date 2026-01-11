import React, { useEffect, useRef } from 'react';
import { Button } from '@heroui/react';

interface CalendarTimeProps {
  slot: string;
  time: string;
  setTime: (time: string) => void;
  isDisabled?: boolean;
}

export default function CalendarTime({ slot, time, setTime, isDisabled }: CalendarTimeProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);
  const timeSlotRef = useRef<HTMLDivElement>(null);

  // TODO: This is not working
  useEffect(() => {
    if (time === slot && confirmRef.current) {
      confirmRef.current.focus();
      timeSlotRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [time, slot]);

  return (
    <div ref={timeSlotRef} className="relative flex w-full justify-end gap-2">
      <Button
        fullWidth
        onPress={() => {
          setTime(slot);
        }}
        color={time === slot ? 'primary' : 'default'}
        variant="flat"
        isDisabled={isDisabled}
      >
        {slot}
      </Button>
    </div>
  );
}

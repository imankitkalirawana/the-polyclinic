import { Button } from '@heroui/react';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface CalendarTimeProps {
  slot: string;
  onConfirm: () => void;
  time: string;
  setTime: (time: string) => void;
  isDisabled: boolean;
}

export default function CalendarTime({
  slot,
  onConfirm,
  time,
  setTime,
  isDisabled,
}: CalendarTimeProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);
  const timeSlotRef = useRef<HTMLDivElement>(null);

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
      <motion.div
        animate={{
          width: time === slot ? 'calc(100% - 6.5rem)' : '100%',
        }}
        className="absolute left-0"
        initial={false}
      >
        <Button
          className="w-full bg-default-200 text-xs font-semibold leading-4 text-default-500"
          fullWidth
          onPress={() => {
            setTime(slot);
          }}
          isDisabled={isDisabled}
        >
          {slot}
        </Button>
      </motion.div>
      <motion.div
        animate={{
          width: time === slot ? '6rem' : '0',
          opacity: time === slot ? 1 : 0,
        }}
        className="overflow-hidden opacity-0"
        initial={false}
      >
        <Button
          ref={confirmRef}
          className="w-24"
          color="primary"
          tabIndex={time === slot ? undefined : -1}
          onPress={onConfirm}
          isDisabled={isDisabled}
        >
          Confirm
        </Button>
      </motion.div>
    </div>
  );
}

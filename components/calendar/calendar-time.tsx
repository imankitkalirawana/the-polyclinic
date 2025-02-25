import type { TimeSlot } from './calendar';

import { Button } from '@heroui/button';
import { motion } from 'framer-motion';
import { useRef } from 'react';

interface CalendarTimeProps {
  slot: TimeSlot;
  timeSlots: TimeSlot[];
  isSelected: boolean;
  onTimeChange: (time: string, selectedTimeSlotRange?: TimeSlot[]) => void;
  onConfirm: () => void;
}

export default function CalendarTime({
  slot,
  isSelected,
  onTimeChange,
  onConfirm,
  timeSlots
}: CalendarTimeProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="relative flex w-full justify-end gap-2">
      <motion.div
        animate={{ width: isSelected ? 'calc(100% - 6.5rem)' : '100%' }}
        className="absolute left-0"
        initial={false}
      >
        <Button
          className="w-full bg-default-100 text-xs font-semibold leading-4 text-default-500"
          onPress={() => {
            const selectedTimeSlotRange = [];
            const index = timeSlots.findIndex((s) => s.value === slot.value);

            if (index !== timeSlots.length - 1) {
              selectedTimeSlotRange.push(
                timeSlots[index],
                timeSlots[index + 1]
              );
            } else {
              selectedTimeSlotRange.push(timeSlots[index], timeSlots[index]);
            }
            onTimeChange(slot.value, selectedTimeSlotRange);
            // for easier keyboard navigation
            confirmRef.current?.focus();
          }}
        >
          {slot.label}
        </Button>
      </motion.div>
      <motion.div
        animate={{
          width: isSelected ? '6rem' : '0',
          opacity: isSelected ? 1 : 0
        }}
        className="overflow-hidden opacity-0"
        initial={false}
      >
        <Button
          ref={confirmRef}
          className="w-24"
          color="primary"
          tabIndex={isSelected ? undefined : -1}
          onPress={onConfirm}
        >
          Confirm
        </Button>
      </motion.div>
    </div>
  );
}

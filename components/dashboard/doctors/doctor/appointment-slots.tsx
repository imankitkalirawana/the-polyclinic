'use client';
import { TIMINGS } from '@/lib/config';
import { faker } from '@faker-js/faker';
import {
  Card,
  CardBody,
  CardHeader,
  cn,
  ScrollShadow,
  Tooltip,
} from '@heroui/react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

type Slot = {
  id: string;
  time: string;
  slots: number;
  isAvailable: boolean;
};

function generateSlots(start: number, end: number, interval: number): Slot[] {
  const slots: Slot[] = [];
  let hour = start;
  let minute = 0;

  while (hour < end || (hour === end && minute === 0)) {
    const totalSlots = faker.number.int({ min: 0, max: 10 });
    const isAvailable = faker.datatype.boolean();

    // Format hour for 12-hour clock
    const h = hour % 12 === 0 ? 12 : hour % 12;
    // Determine AM/PM
    const ampm = hour < 12 ? 'AM' : 'PM';
    // Format time string (e.g., "09:00 AM")
    const time = `${h.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${ampm}`;

    // Assume all slots are available for now (can be adjusted based on logic like holidays or bookings)
    slots.push({ id: uuidv4(), time, slots: totalSlots, isAvailable });

    // Increment time by interval
    minute += interval;
    if (minute >= 60) {
      hour += 1;
      minute = 0;
    }
  }

  return slots;
}

export default function AppointmentSlots() {
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const slots = generateSlots(
    TIMINGS.appointment.start,
    TIMINGS.appointment.end,
    TIMINGS.appointment.interval
  );

  return (
    <Card className="col-span-full">
      <CardHeader>
        <h3 className="text-lg font-medium">Today&apos;s Slots</h3>
      </CardHeader>
      <CardBody
        className="flex-row items-center gap-2 overflow-x-auto"
        as={ScrollShadow}
        orientation="horizontal"
      >
        {slots.map((slot) => (
          <Tooltip
            key={slot.id}
            content={`${slot.slots} slots available`}
            placement="top"
          >
            <Card
              isPressable
              isDisabled={!slot.isAvailable}
              onPress={() => setSelectedSlot(slot)}
              className={cn(
                'flex h-fit items-center justify-center overflow-visible rounded-medium border border-divider px-4 py-2',
                {
                  'bg-default-200': !slot.isAvailable || slot.slots === 0,
                }
              )}
            >
              <p className="whitespace-nowrap">{slot.time}</p>
            </Card>
          </Tooltip>
        ))}
      </CardBody>
    </Card>
  );
}

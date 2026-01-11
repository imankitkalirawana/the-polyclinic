'use client';
import { DayView } from '@/components/dashboard/appointments/all/views/day';
import { AppointmentType } from '@/services/client/appointment';
import { Calendar } from '@heroui/react';
import { getLocalTimeZone, today } from '@internationalized/date';
import { faker } from '@faker-js/faker';
import { uuidv4 } from 'zod';

// @ts-ignore
const appointments: AppointmentType[] = Array.from({ length: 10 }, (_) => ({
  id: uuidv4(),
  aid: faker.string.uuid(),
  //   date: faker.date.recent(),
  date: new Date(),
  patient: {
    uid: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    gender: faker.person.sexType(),
    age: faker.number.int({ min: 18, max: 60 }),
    image: faker.image.avatar(),
  },
  status: 'booked',
  additionalInfo: {
    type: 'online',
    notes: 'Some notes',
    symptoms: 'Some symptoms',
    description: 'Some description',
    instructions: 'Some instructions',
  },
  type: 'consultation',
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: '1234567890',
  updatedBy: '1234567890',
}));

export default function Sidebar() {
  return (
    <div className="flex h-full w-full max-w-fit flex-col items-center gap-4 rounded-large bg-default-100 p-2">
      <div>
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
      </div>

      <section className="w-full overflow-auto rounded-large bg-background">
        <DayView
          isCompact
          openInNewTab
          appointments={appointments}
          currentDate={new Date()}
          onTimeSlotClick={() => {}}
        />
      </section>
    </div>
  );
}

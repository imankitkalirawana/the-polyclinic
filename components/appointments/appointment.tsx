'use client';
import { AppointmentType } from '@/models/Appointment';
import { AccordionItem } from '@nextui-org/react';

interface AppointmentProp {
  appointment: AppointmentType;
}

export default function Appointment({ appointment }: AppointmentProp) {
  return (
    <>
      <AccordionItem
        key={appointment.aid}
        aria-label="Accordion 1"
        title={'Title'}
      >
        Helo
      </AccordionItem>
    </>
  );
}

import { DateValue, isWeekend } from '@internationalized/date';

import { disabledDates } from '@/libs/appointments/new';
import { TIMINGS } from '@/libs/config';

export const generateTimeSlots = () => {
  const slots: string[] = [];
  let totalMinutes = TIMINGS.appointment.start * 60;

  while (totalMinutes < TIMINGS.appointment.end * 60) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    slots.push(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
    totalMinutes += TIMINGS.appointment.interval;
  }

  return slots;
};

export const getTimeSlot = (date: Date) => {
  const timeSlots = generateTimeSlots();
  const nextTimeSlot = timeSlots.find((slot) => {
    const [hours, minutes] = slot.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    return newDate.toISOString() === date.toISOString();
  });
  return nextTimeSlot || timeSlots[0];
};

export const getNextAvailableTimeSlot = (date: Date) => {
  const timeSlots = generateTimeSlots();
  const nextTimeSlot = timeSlots.find((slot) => {
    const [hours, minutes] = slot.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    return newDate.toISOString() > date.toISOString();
  });
  return nextTimeSlot || timeSlots[0];
};

export const getDateTime = (date: Date, time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours);
  newDate.setMinutes(minutes);
  return newDate;
};

export const isDateUnavailable = (date: DateValue, timeZone: string) =>
  isWeekend(date, timeZone) || disabledDates[0].map((d) => d.compare(date)).includes(0);

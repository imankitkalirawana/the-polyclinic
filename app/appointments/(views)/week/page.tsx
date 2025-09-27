'use client';

import { WeekView } from '@/components/ui/calendar/views/week';

export default function WeekPage() {
  return <WeekView appointments={[]} currentDate={new Date()} onTimeSlotClick={() => {}} />;
}

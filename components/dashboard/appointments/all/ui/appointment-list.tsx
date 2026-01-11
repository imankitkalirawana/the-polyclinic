import React from 'react';
import { Card, CardBody, CardFooter, CardHeader, ScrollShadow } from '@heroui/react';
import { format } from 'date-fns';
import { parseAsIsoDateTime, parseAsStringEnum, useQueryState } from 'nuqs';

import { views } from '../types';
import DateChip from './date-chip';

import { AppointmentType } from '@/services/client/appointment';
import AppointmentTriggerItem from './appointment-trigger-item';

export default function AppointmentList({
  appointments,
  date,
  openInNewTab = false,
}: {
  appointments: AppointmentType[] | null;
  date: Date;
  openInNewTab?: boolean;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_currentDate, setCurrentDate] = useQueryState(
    'date',
    parseAsIsoDateTime.withDefault(new Date())
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_view, setView] = useQueryState('view', parseAsStringEnum(views));

  return (
    <Card className="flex max-w-xs flex-col shadow-none">
      <CardHeader className="flex-col items-center gap-2 pb-0">
        <span className="font-medium uppercase text-small">{format(date, 'E')}</span>
        <DateChip
          date={date}
          size="lg"
          onClick={() => {
            setCurrentDate(date);
            setView('day');
          }}
        />
      </CardHeader>
      <CardBody as={ScrollShadow} className="max-h-40 flex-col pt-2">
        {appointments && appointments.length > 0 ? (
          appointments.map((appointment) => (
            <AppointmentTriggerItem
              key={appointment.aid}
              appointment={appointment}
              openInNewTab={openInNewTab}
            />
          ))
        ) : (
          <p className="pb-4 text-center text-default-500 text-small">
            There are no appointments for this day
          </p>
        )}
      </CardBody>
      <CardFooter className="pt-0">
        {appointments && appointments.length > 0 && (
          <p className="text-center text-default-500 text-tiny">
            Total appointments: {appointments.length}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}

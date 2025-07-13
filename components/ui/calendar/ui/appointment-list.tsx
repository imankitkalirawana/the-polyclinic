import { AppointmentType } from '@/types/appointment';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  cn,
  ScrollShadow,
} from '@heroui/react';
import { parseAsIsoDateTime, parseAsStringEnum, useQueryState } from 'nuqs';
import { format } from 'date-fns';
import DateChip from './date-chip';
import StatusRenderer from './status-renderer';
import { formatTime } from '../helper';
import { views } from '../types';
import { useAppointmentStore } from '@/store/appointment';

export default function AppointmentList({
  appointments,
  date,
}: {
  appointments: AppointmentType[] | null;
  date: Date;
}) {
  const [_currentDate, setCurrentDate] = useQueryState(
    'date',
    parseAsIsoDateTime.withDefault(new Date())
  );
  const [_view, setView] = useQueryState('view', parseAsStringEnum(views));
  const { setAppointment } = useAppointmentStore();

  return (
    <Card className="flex max-w-xs flex-col shadow-none">
      <CardHeader className="flex-col items-center gap-2 pb-0">
        <span className="text-small font-medium uppercase">
          {format(date, 'E')}
        </span>
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
            <button
              key={appointment.aid}
              className={cn(
                'flex min-h-6 cursor-pointer items-center justify-start gap-1 truncate rounded-lg p-1 text-tiny hover:bg-default-100 md:px-2',
                appointment.status === 'cancelled' && 'line-through'
              )}
              onClick={(e) => {
                e.stopPropagation();
                setAppointment(appointment);
              }}
            >
              <StatusRenderer isDotOnly status={appointment.status} />
              <div className="hidden font-light sm:block">
                {formatTime(new Date(appointment.date))}
              </div>
              <div className="font-medium">
                {appointment.patient.name}{' '}
                {appointment.doctor?.name ? `- ${appointment.doctor.name}` : ''}
              </div>
            </button>
          ))
        ) : (
          <p className="pb-4 text-center text-small text-default-500">
            There are no appointments for this day
          </p>
        )}
      </CardBody>
      <CardFooter className="pt-0">
        {appointments && appointments.length > 0 && (
          <p className="text-center text-tiny text-default-500">
            Total appointments: {appointments.length}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}

'use client';

import { CalendarDays, Clock, X } from 'lucide-react';
import { Button, Card, Chip, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { format } from 'date-fns';
import CellValue from '@/components/ui/cell-value';
import { AppointmentType } from '@/models/Appointment';
import { useQuery } from '@tanstack/react-query';
import { getAppointmentWithAID } from '@/functions/server-actions/appointment';
import NoResults from '@/components/ui/no-results';
import { buttonColorMap, ChipColorMap, genderMap } from '@/lib/maps';
import AsyncComponent from '@/hooks/useAsyncLoading';
import Skeleton from '@/components/ui/skeleton';
import { getDoctorWithUID } from '@/functions/server-actions';

interface AppointmentProps {
  aid: number;
}

export default function Appointment({ aid }: AppointmentProps) {
  const {
    data: appointment,
    isError,
    error
  } = useQuery<AppointmentType>({
    queryKey: ['appointment', aid],
    queryFn: () => getAppointmentWithAID(aid)
  });

  if (isError) {
    return (
      <NoResults message="Appointment Not Found" description={error.message} />
    );
  }

  if (!appointment) {
    return <NoResults message="Appointment Not Found" />;
  }

  return (
    <div className="justify-centerp-4 flex items-center">
      <Card className="w-full">
        <div className="flex flex-col md:flex-row">
          {/* Left Column - Date and Time */}
          <div className="flex border-b border-divider p-6 md:w-64 md:border-b-0 md:border-r">
            <div className="flex flex-col justify-between space-y-4">
              <div className="flex min-w-24 max-w-24 flex-col gap-4 sm:min-w-40 sm:max-w-40">
                <div className="flex-col gap-4">
                  <h4 className="text-xs text-default-500">On</h4>
                  <p className="whitespace-nowrap font-semibold">
                    {format(appointment.date, 'PP')}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-xs text-default-500">At</h4>
                  <p className="whitespace-nowrap font-semibold">
                    {format(appointment.date, 'p')}
                  </p>
                </div>
                <CellValue
                  label="Indian Standard Time"
                  className="flex-col"
                  value="UTC +05:30"
                />
              </div>

              <Button
                color="secondary"
                variant="bordered"
                startContent={<Icon icon="solar:calendar-bold" />}
              >
                Add to Calendar
              </Button>
            </div>
          </div>

          {/* Right Column - Appointment Details */}
          <div className="flex-1 p-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="mb-1 text-xl font-semibold">
                    {appointment.name}
                  </h1>
                  <div className="flex gap-2">
                    <Chip variant="flat">#{appointment.aid}</Chip>
                    <Tooltip
                      showArrow
                      color={ChipColorMap[appointment.status]}
                      content="Appointment Status"
                      delay={500}
                    >
                      <Chip
                        color={ChipColorMap[appointment.status]}
                        radius="sm"
                        variant="flat"
                        className="capitalize"
                      >
                        {appointment.status}
                      </Chip>
                    </Tooltip>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="flex w-full flex-col">
                <div className="flex flex-col sm:flex-row sm:gap-8">
                  <CellValue label="Phone" value={`+91 ${appointment.phone}`} />
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-8">
                  <CellValue label="Email" value={appointment.email} />
                  <CellValue label="Phone" value={`+91 ${appointment.phone}`} />
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-8">
                  <CellValue
                    label="Doctor"
                    value={
                      <AsyncComponent
                        fetchData={() => getDoctorWithUID(appointment.doctor)}
                        fallback={<Skeleton className="h-5 w-20" />}
                        render={(doctor) => <span>{doctor?.name || '-'}</span>}
                      />
                    }
                  />
                  <CellValue
                    label="Location"
                    value={<p className="capitalize">{appointment.type}</p>}
                    className="justify-start gap-4"
                  />
                </div>
                {appointment.notes && (
                  <CellValue
                    label="Appointment Notes"
                    value={appointment?.notes}
                  />
                )}
                <CellValue
                  label={`Created at: ${format(appointment?.createdAt as Date, 'PPp')}`}
                  value={null}
                />
                <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
                  <div className="flex w-full items-center gap-2">
                    {['booked', 'confirmed', 'overdue'].includes(
                      appointment.status
                    ) && (
                      <Button
                        color={buttonColorMap['reschedule']}
                        // onPress={() => handleButtonClick('reschedule')}
                        variant="flat"
                        className="w-full sm:w-fit"
                        startContent={<Icon icon="solar:calendar-bold" />}
                      >
                        Reschedule
                      </Button>
                    )}
                  </div>
                  <div className="flex w-full items-center gap-2 sm:w-fit">
                    {['completed'].includes(appointment.status) && (
                      <Button
                        className="w-full sm:w-fit"
                        variant="bordered"
                        color={buttonColorMap['download']}
                      >
                        <Icon icon="solar:download-minimalistic-bold" />
                        Download
                      </Button>
                    )}
                    {[
                      'booked',
                      'overdue',
                      'confirmed',
                      'in-progress',
                      'on-hold'
                    ].includes(appointment.status) && (
                      <Button
                        className="w-full sm:w-fit"
                        color={buttonColorMap['cancel']}
                        // onPress={() => handleButtonClick('cancel')}
                        variant="bordered"
                        startContent={<Icon icon="tabler:x" />}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

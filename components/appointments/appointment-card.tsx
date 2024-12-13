'use client';
import { useEffect, useState } from 'react';
import React from 'react';
import { LocateIcon, TruckIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Appointment } from '@/lib/interface';
import { humanReadableDate, humanReadableTime } from '@/lib/utility';
import { Card, Tooltip } from '@nextui-org/react';
import axios from 'axios';
import { getDoctorWithUID } from '@/functions/server-actions';
import { DoctorType } from '@/models/Doctor';

interface AppointmentCardProps {
  progress?: number;
  arrivalTime?: string;
  location?: string;
  timeAgo?: string;
  appointment: Appointment;
}

const AppointmentCard = ({
  progress = 0,
  timeAgo = '30 min',
  appointment
}: AppointmentCardProps) => {
  const [adjustedProgress, setAdjustedProgress] = useState(progress);
  const [doctor, setDoctor] = useState<DoctorType | null>({} as DoctorType);

  useEffect(() => {
    const fetchData = async () => {
      await getDoctorWithUID(appointment.doctor).then((doctor) => {
        setDoctor(doctor as DoctorType);
      });
    };
    fetchData();
  }, []);

  const totalTime =
    (new Date(appointment.date) as any) -
    (new Date(appointment.createdAt) as any);

  const timePassed =
    (new Date() as any) - (new Date(appointment.createdAt) as any);

  // percentage of progress
  useEffect(() => {
    const progress = (timePassed / totalTime) * 100;
    if (progress < 100) {
      setAdjustedProgress(progress);
    }
  }, []);

  return (
    <Card className="relative w-full overflow-hidden rounded-3xl text-background">
      <div className="absolute right-2 z-10 h-28 w-5 bg-background/30">
        <div className="absolute -bottom-2 z-0 h-4 w-full rotate-45 bg-default-700"></div>
      </div>

      <div className="flex h-full flex-col justify-between">
        <div className="relative w-full bg-default-500 px-4 pb-2 pt-4">
          <div className="absolute right-2 top-0 flex h-full w-5 justify-center">
            <div className="z-20 w-[2px] bg-default-500"></div>
          </div>
          <p className="text-md">{}</p>
          <p className="flex items-center justify-between gap-2 text-xl font-bold">
            <span>{humanReadableDate(appointment.date)}</span>
            <span className="text-sm font-normal">
              {humanReadableTime(appointment.date)}
            </span>
          </p>
        </div>

        <div className="border-t-2 border-t-divider bg-default-700 px-4 pb-4 pt-2">
          <p
            className={cn('w-full capitalize', {
              'text-danger-500':
                appointment.status === 'cancelled' ||
                appointment.status === 'overdue',
              'text-default-400': appointment.status === 'booked',
              'text-blue-500': appointment.status === 'in-progress',
              'text-success-500': appointment.status === 'completed',
              'text-warning-500': appointment.status === 'on-hold'
            })}
          >
            {appointment.status}
          </p>
          <div className="relative mx-0.5 mb-6 mt-5 bg-default-400">
            <div
              className={cn(
                'absolute left-0 top-1/2 z-20 size-3 -translate-y-1/2 rounded-full',
                {
                  'bg-danger-300': adjustedProgress <= 20,
                  'bg-danger-200': adjustedProgress >= 40,
                  'bg-warning-500': adjustedProgress >= 60,
                  'bg-success-500': adjustedProgress >= 80,
                  'bg-success-300': adjustedProgress == 100,
                  'bg-danger-400': adjustedProgress == 101,
                  'bg-danger-500': adjustedProgress == 102
                }
              )}
            ></div>
            <div className="absolute right-0 top-1/2 z-10 size-3 -translate-y-1/2 rounded-full bg-default-400"></div>
            <div
              className={cn(
                'relative h-0.5 transition-all ease-in-out [transition-duration:500ms]',
                {
                  'bg-danger-300': adjustedProgress <= 20,
                  'bg-danger-200': adjustedProgress >= 40,
                  'bg-warning-500': adjustedProgress >= 60,
                  'bg-success-500': adjustedProgress >= 80,
                  'bg-success-300': adjustedProgress == 100,
                  'bg-danger-400': adjustedProgress == 101,
                  'bg-danger-500': adjustedProgress == 102
                }
              )}
              style={{
                width: `${adjustedProgress}%`
              }}
            >
              <Tooltip
                color={
                  adjustedProgress <= 20
                    ? 'danger'
                    : adjustedProgress <= 40
                      ? 'danger'
                      : adjustedProgress <= 60
                        ? 'warning'
                        : adjustedProgress <= 80
                          ? 'warning'
                          : adjustedProgress <= 100
                            ? 'success'
                            : adjustedProgress == 101
                              ? 'danger'
                              : adjustedProgress == 102
                                ? 'danger'
                                : 'default'
                }
                isDisabled={adjustedProgress > 100}
                content={`${parseInt(adjustedProgress as any)}%`}
              >
                <Icon
                  icon="solar:test-tube-broken"
                  className={cn(
                    'absolute right-0 top-1/2 z-50 size-8 -translate-y-1/2 translate-x-1/2 rounded-full p-1.5 transition-all duration-500',
                    {
                      'bg-danger-300 text-danger-foreground':
                        adjustedProgress <= 20,
                      'bg-danger-200 text-danger-foreground':
                        adjustedProgress >= 40,
                      'bg-warning-500 text-warning-foreground':
                        adjustedProgress >= 60,
                      'bg-success-500 text-success-foreground':
                        adjustedProgress >= 80,
                      'bg-success-300 text-success-foreground':
                        adjustedProgress >= 100,
                      'bg-danger-400 text-danger-foreground':
                        adjustedProgress == 101,
                      'bg-danger-500 text-danger-foreground':
                        adjustedProgress == 102
                    }
                  )}
                />
              </Tooltip>
            </div>
          </div>

          <div className="my-1 flex gap-1 tracking-tight text-default-400">
            <Icon icon="maki:doctor" />
            <div>
              <span className="line-clamp-1 text-sm leading-none">
                {doctor?.name}
              </span>
              <span className="text-sm leading-none">{timeAgo} ago</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AppointmentCard;

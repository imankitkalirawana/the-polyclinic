'use client';
import { Card, Chip, ScrollShadow } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { format } from 'date-fns';
import { motion, useAnimation } from 'framer-motion';
import React from 'react';

import { cn } from '@/lib/utils';
import { AppointmentType } from '@/types/appointment';

import { getAppointmentStyles } from '../appointments/compact-view/appointments';
import { useForm } from '../appointments/compact-view/context';

interface CalendarWidgetProps {
  className?: string;
  isIcon?: boolean;
  appointments?: AppointmentType[];
}

const TypeIcon: Record<AppointmentType['type'], string> = {
  consultation: 'solar:stethoscope-bold',
  'follow-up': 'solar:clipboard-check-linear',
  emergency: 'solar:adhesive-plaster-linear',
};

export default function CalendarWidget({
  className,
  isIcon,
  appointments = [],
}: CalendarWidgetProps) {
  return (
    <>
      <ScrollShadow
        className={cn(
          'flex max-h-48 flex-col items-end gap-1 bg-transparent scrollbar-hide',
          className
        )}
      >
        {appointments.map((appointment) => (
          <Appointment
            key={appointment.aid}
            appointment={appointment}
            isIcon={isIcon}
          />
        ))}
      </ScrollShadow>
    </>
  );
}

function Appointment({
  appointment,
  isIcon,
}: {
  appointment: AppointmentType;
  isIcon?: boolean;
}) {
  const styles = getAppointmentStyles(appointment.status);
  const chipControls = useAnimation();
  const { formik } = useForm();

  return (
    <Card
      as={motion.div}
      initial={{ width: '180px' }}
      whileHover={{ width: isIcon ? '180px' : '230px' }}
      key={appointment.aid}
      className={cn(
        `group min-h-10 max-w-[calc(fit-content+10px)] justify-center rounded-large px-2 py-1`,
        styles.background
      )}
      isPressable
      onPress={() => {
        formik.setFieldValue('selected', appointment);
      }}
      shadow="none"
      onHoverStart={() =>
        chipControls.start({
          opacity: 1,
          scale: 1,
          width: '80px',
          display: 'flex',
        })
      }
      onHoverEnd={() =>
        chipControls.start({
          opacity: 0,
          scale: 0,
          width: 0,
          display: 'none',
        })
      }
    >
      <div className="flex items-center justify-start gap-4">
        {isIcon ? (
          <div className={`rounded-medium p-2 ${styles.iconBg}`}>
            <Icon
              icon={TypeIcon[appointment.type]}
              className={`h-5 w-5 ${styles.icon}`}
            />
          </div>
        ) : (
          <Chip size="sm" className={`rounded-medium p-2 ${styles.iconBg}`}>
            <motion.span
              initial={{
                opacity: 0,
                scale: 0,
                width: 0,
                display: 'none',
              }}
              animate={chipControls}
              className="max-w-fit overflow-hidden capitalize text-white"
            >
              {appointment.status.split('-').join(' ')}
            </motion.span>
          </Chip>
        )}
        <div className="flex flex-1 items-center justify-between">
          <div className="flex flex-col items-start text-tiny">
            <h3 className="line-clamp-1 font-semibold capitalize text-default-900">
              {appointment.patient.name}
            </h3>
            <p className="flex gap-1 text-default-500">
              <span className="line-clamp-1 capitalize">
                #{appointment.aid}
              </span>
              <span>•</span>
              <span>{format(new Date(appointment.date), 'HH:mm')}</span>
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

'use client';
import { cn } from '@/lib/utils';
import { AppointmentType } from '@/models/Appointment';
import { Card, Chip, ScrollShadow } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { getAppointmentStyles } from '../appointments/compact-view/appointments';
import { format } from 'date-fns';
import { useRouter } from 'nextjs-toploader/app';
import { motion, useAnimation } from 'framer-motion';

interface CalendarWidgetProps {
  className?: string;
  appointments?: AppointmentType[];
  isDark?: boolean;
}

export default function CalendarWidget({
  appointments = []
}: CalendarWidgetProps) {
  return (
    <>
      <ScrollShadow className="flex max-h-48 flex-col items-end gap-1 bg-transparent scrollbar-hide">
        {appointments.map((appointment) => (
          <Appointment key={appointment.aid} appointment={appointment} />
        ))}
      </ScrollShadow>
    </>
  );
}

function Appointment({ appointment }: { appointment: AppointmentType }) {
  const styles = getAppointmentStyles(appointment.status);
  const chipControls = useAnimation();
  return (
    <Card
      as={motion.div}
      initial={{ width: '180px' }}
      whileHover={{ width: '230px' }}
      key={appointment.aid}
      className={cn(
        `group min-h-10 justify-center rounded-large px-2 py-1`,
        styles.background
      )}
      isPressable
      shadow="none"
      onHoverStart={() =>
        chipControls.start({
          opacity: 1,
          scale: 1,
          width: 'auto',
          display: 'flex'
        })
      }
      onHoverEnd={() =>
        chipControls.start({
          opacity: 0,
          scale: 0,
          width: 0,
          display: 'none'
        })
      }
    >
      <div className="flex items-center justify-start gap-4">
        <Chip size="sm" className={`rounded-medium p-2 ${styles.iconBg}`}>
          <motion.span
            initial={{
              opacity: 0,
              scale: 0,
              width: 0,
              display: 'none'
            }}
            animate={chipControls}
            className="overflow-hidden capitalize text-white"
          >
            {appointment.status.split('-').join(' ')}
          </motion.span>
        </Chip>
        <div className="flex flex-1 items-center justify-between">
          <div className="flex flex-col items-start text-xs">
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

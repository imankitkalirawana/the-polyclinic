'use client';

import type { CalendarBookingStepType } from './types';

import { useCallback } from 'react';
import { Icon } from '@iconify/react';
import { Spacer, Chip, Link, Button } from '@heroui/react';

interface CalendarBookingConfirmationProps {
  setCalendarBookingStep?: (step: CalendarBookingStepType) => void;
}

export default function CalendarBookingConfirmation({
  setCalendarBookingStep,
}: CalendarBookingConfirmationProps) {
  const handleCancelOrReschedule = useCallback(() => {
    if (setCalendarBookingStep) setCalendarBookingStep('booking_initial');
  }, [setCalendarBookingStep]);

  return (
    <div className="flex w-[375px] flex-col items-center gap-5 rounded-large bg-default-50 py-8 shadow-small">
      <div className="flex w-full flex-col items-center px-8">
        <Icon
          className="mb-3 text-success-500"
          icon="solar:check-circle-bold-duotone"
          width={56}
        />
        <p className="mb-2 text-base font-medium text-default-foreground">
          This appointment is scheduled
        </p>
        <p className="text-center text-tiny text-default-500">
          We sent an email with a calendar invitation with the details to
          everyone.
        </p>
      </div>
      <Spacer className="w-full bg-default-100" x={0} y={0} />
      <div className="flex w-full flex-col items-center gap-4 px-8">
        <div className="flex w-full flex-col gap-1">
          <p className="text-small font-medium text-default-foreground">
            Details
          </p>
          <p className="text-tiny text-default-500">
            30min meeting between Zoey Lang and John Thompson
          </p>
        </div>
        <div className="flex w-full flex-col gap-1">
          <p className="text-small font-medium text-default-foreground">When</p>
          <p className="text-tiny text-default-500">
            Friday, December 27, 2024
            <br />
            6:30 PM - 7:00 PM (Argentina Standard Time)
          </p>
        </div>
        <div className="flex w-full flex-col gap-1">
          <p className="text-small font-medium text-default-foreground">
            Invited
          </p>
          <span className="flex items-center gap-1">
            <p className="text-tiny text-default-500">
              Zoey Lang (zoey@email.com)
            </p>
            <Chip
              classNames={{
                base: 'px-0.5 h-4',
                content: 'text-[10px] leading-3',
              }}
              color="primary"
              size="sm"
              variant="flat"
            >
              Host
            </Chip>
          </span>
          <p className="text-tiny text-default-500">
            John Thompson (john.thompson@email.com)
          </p>
        </div>
        <div className="flex w-full flex-col gap-1">
          <p className="text-small font-medium text-default-foreground">
            Where
          </p>
          <Link className="flex w-fit items-center gap-1" href="#" size="sm">
            <p className="text-tiny text-default-500">Zoom</p>
            <Icon
              className="text-default-500"
              icon="mdi:open-in-new"
              width={12}
            />
          </Link>
        </div>
        <div className="flex w-full flex-col gap-1">
          <p className="text-small font-medium text-default-foreground">
            Additional notes
          </p>
          <span className="flex items-center gap-1">
            <p className="text-tiny text-default-500">
              Let&apos;s talk about the latest updates of the project
            </p>
          </span>
        </div>
      </div>
      <Spacer className="w-full bg-default-100" x={0} y={0} />
      <p className="text-center text-tiny text-default-500">
        Need to make a change?{' '}
        <Link
          className="text-small text-default-800"
          href="#"
          size="sm"
          underline="always"
          onPress={handleCancelOrReschedule}
        >
          Reschedule
        </Link>{' '}
        or{' '}
        <Link
          className="text-small text-default-800"
          href="#"
          size="sm"
          underline="always"
          onPress={handleCancelOrReschedule}
        >
          Cancel
        </Link>
      </p>
      <Spacer className="w-full bg-default-100" x={0} y={0} />
      <div className="flex flex-col items-center gap-2">
        <p className="text-tiny text-default-500">Add to calendar</p>
        <div className="flex items-center gap-2">
          <Button isIconOnly className="bg-default-100" size="sm">
            <Icon className="text-default-600" icon="mdi:google" width={16} />
          </Button>
          <Button isIconOnly className="bg-default-100" size="sm">
            <Icon
              className="text-default-600"
              icon="mdi:microsoft-outlook"
              width={16}
            />
          </Button>
          <Button isIconOnly className="bg-default-100" size="sm">
            <Icon
              className="text-default-600"
              icon="mdi:microsoft-office"
              width={16}
            />
          </Button>
          <Button isIconOnly className="bg-default-100" size="sm">
            <Icon
              className="text-default-600"
              icon="mdi:calendar-outline"
              width={16}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}

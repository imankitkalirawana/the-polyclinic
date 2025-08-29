'use client';

import { Button, Chip, Kbd } from '@heroui/react';
import { format, isPast, isValid } from 'date-fns';
import { useFormikContext } from 'formik';

import { CreateAppointmentFormValues } from '../types';
import CreateAppointmentContentContainer from '../ui/content-container';
import CreateAppointmentContentHeader from '../ui/header';
import CreateAppointmentTimeSelection from './time';

import { SlotsPreview } from '@/components/dashboard/doctors/doctor/slots/slots-preview';
import { useSlotsByUID } from '@/hooks/queries/client/slots';
import { useKeyPress } from '@/hooks/useKeyPress';

function AvailabilityChip({ date }: { date: Date | undefined }) {
  if (!date || !isValid(date)) {
    return (
      <Chip color="warning" variant="dot">
        No date selected
      </Chip>
    );
  }

  if (isPast(date)) {
    return (
      <Chip color="danger" variant="dot">
        Slot not available
      </Chip>
    );
  }

  return (
    <Chip color="success" variant="dot">
      Available
    </Chip>
  );
}

function DateDisplay({ date }: { date: Date | undefined }) {
  if (!date || !isValid(date)) {
    return <div className="text-sm text-default-500">No date selected</div>;
  }

  return <div className="text-sm font-medium">{format(date, 'PPPp')}</div>;
}

function EmptySlotState({ message }: { message: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <p className="text-sm text-default-500">{message}</p>
    </div>
  );
}

function SlotContent({
  doctorId,
  selectedDate,
  onDateSelect,
}: {
  doctorId: string;
  selectedDate: Date | undefined;
  onDateSelect: (date: Date) => void;
}) {
  const { data: slot, isLoading: isSlotsLoading } = useSlotsByUID(doctorId);

  if (isSlotsLoading) {
    return <EmptySlotState message="Loading available slots..." />;
  }

  if (!slot) {
    return <EmptySlotState message="No slots available for this doctor" />;
  }

  return <SlotsPreview selected={selectedDate} config={slot} onSlotSelect={onDateSelect} />;
}

export default function DateSelectionContainer() {
  const { values, setFieldValue } = useFormikContext<CreateAppointmentFormValues>();
  const { appointment } = values;

  const isDateValid = appointment.date && isValid(appointment.date);
  const canProceed = isDateValid && !isPast(appointment.date);

  const handleNext = () => {
    setFieldValue('meta.currentStep', 4);
  };

  const handleDateSelect = (date: Date) => {
    setFieldValue('appointment.date', date);
  };

  // Handle Enter key to proceed
  useKeyPress(
    ['Enter'],
    () => {
      if (canProceed) {
        handleNext();
      }
    },
    { capture: true }
  );

  const renderContent = () => {
    // If doctor is selected, show doctor's available slots
    if (appointment.doctorId) {
      return (
        <SlotContent
          doctorId={appointment.doctorId}
          selectedDate={appointment.date}
          onDateSelect={handleDateSelect}
        />
      );
    }

    // If no doctor selected, show general time selection
    return <CreateAppointmentTimeSelection date={appointment.date} setDate={handleDateSelect} />;
  };

  return (
    <CreateAppointmentContentContainer
      header={
        <CreateAppointmentContentHeader
          title="Date Selection"
          description="Select the date and time for the appointment"
          endContent={<DateDisplay date={appointment.date} />}
        />
      }
      footer={
        <>
          <Button
            variant="shadow"
            color="primary"
            radius="full"
            onPress={handleNext}
            isDisabled={!canProceed}
            endContent={<Kbd keys={['enter']} className="bg-transparent" />}
          >
            Next
          </Button>
          <AvailabilityChip date={appointment.date} />
        </>
      }
    >
      {renderContent()}
    </CreateAppointmentContentContainer>
  );
}

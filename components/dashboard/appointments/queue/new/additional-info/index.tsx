import { useFormContext } from 'react-hook-form';
import {
  CreateAppointmentContentContainer,
  CreateAppointmentContentHeader,
} from '../../../(common)';
import { Button, Textarea } from '@heroui/react';
import { BookQueueSteps } from '@/components/dashboard/appointments/create/data';
import { CreateAppointmentQueueFormValues } from '@/services/client/appointment/queue/queue.types';
import DateScroll from '../../../(common)/date-scroll';

export default function AdditionalInfo() {
  const form = useFormContext<CreateAppointmentQueueFormValues>();
  const notes = form.watch('appointment.notes');
  const appointmentDate = form.watch('appointment.appointmentDate');

  const handleDateSelect = (date: Date) => {
    form.setValue('appointment.appointmentDate', date);
  };

  return (
    <CreateAppointmentContentContainer
      header={
        <CreateAppointmentContentHeader
          title="Additional Information"
          description="Please provide additional information for your appointment"
        />
      }
      footer={
        <>
          <Button
            variant="shadow"
            color="primary"
            radius="full"
            onPress={() => form.setValue('meta.currentStep', BookQueueSteps.REVIEW_AND_PAY)}
            // endContent={<Kbd keys={['enter']} className="bg-transparent text-primary-foreground" />}
          >
            Next
          </Button>
        </>
      }
    >
      <div>
        <DateScroll
          selectedDate={appointmentDate}
          setSelectedDate={handleDateSelect}
          hidePastDates={true}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Textarea
          label="Additional Notes"
          placeholder="Any additional notes for the doctor"
          value={notes ?? ''}
          onChange={(e) => form.setValue('appointment.notes', e.target.value)}
        />
      </div>
    </CreateAppointmentContentContainer>
  );
}

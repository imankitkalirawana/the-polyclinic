import { useFormContext } from 'react-hook-form';
import { CreateAppointmentFormValues } from '../types';
import {
  CreateAppointmentContentContainer,
  CreateAppointmentContentHeader,
} from '../../../(common)';
import { Button, Textarea } from '@heroui/react';

export default function AdditionalInfo() {
  const form = useFormContext<CreateAppointmentFormValues>();
  const notes = form.watch('appointment.notes');

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
            onPress={() => form.setValue('meta.currentStep', 3)}
            // endContent={<Kbd keys={['enter']} className="bg-transparent text-primary-foreground" />}
          >
            Next
          </Button>
        </>
      }
    >
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

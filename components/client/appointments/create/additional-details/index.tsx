import { Button, Input, Kbd, Select, SelectItem, Textarea } from '@heroui/react';

import CreateAppointmentContentContainer from '../../(common)/content-container';
import CreateAppointmentContentHeader from '../../(common)/header';
import { useCreateAppointmentForm } from '../index';
import { useKeyPress } from '@/hooks/useKeyPress';

export default function CreateAppointmentAdditionalDetails() {
  const { watch, setValue } = useCreateAppointmentForm();
  const appointment = watch('appointment');

  useKeyPress(
    ['Enter'],
    () => {
      setValue('meta.showConfirmation', true);
    },
    { capture: true }
  );

  return (
    <CreateAppointmentContentContainer
      header={
        <CreateAppointmentContentHeader
          title="Additional Details"
          description="Please provide additional details for your appointment"
        />
      }
      footer={
        <Button
          variant="shadow"
          color="primary"
          radius="full"
          onPress={() => setValue('meta.showConfirmation', true)}
          endContent={<Kbd keys={['enter']} className="bg-transparent text-primary-foreground" />}
        >
          Confirm Appointment
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Symptoms"
          value={appointment.additionalInfo?.symptoms}
          placeholder='e.g. "Headache, Fever, etc."'
          className="col-span-2 sm:col-span-1"
          onChange={(e) => setValue('appointment.additionalInfo.symptoms', e.target.value)}
        />
        <Select
          label="Appointment Type"
          selectedKeys={[appointment.additionalInfo?.mode]}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as 'online' | 'offline';
            setValue('appointment.additionalInfo.mode', value);
          }}
          className="col-span-2 sm:col-span-1"
          disabledKeys={['online']}
        >
          <SelectItem key="offline">Clinic</SelectItem>
          <SelectItem key="online">Online</SelectItem>
        </Select>

        <Textarea
          label="Additional Notes"
          placeholder="Any additional notes for the doctor"
          className="col-span-2"
          value={appointment.additionalInfo?.notes}
          onChange={(e) => setValue('appointment.additionalInfo.notes', e.target.value)}
        />
      </div>
    </CreateAppointmentContentContainer>
  );
}

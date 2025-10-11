import { Button, Input, Kbd, Select, SelectItem, Textarea } from '@heroui/react';

import CreateAppointmentContentContainer from '../ui/content-container';
import CreateAppointmentContentHeader from '../ui/header';
import { useCreateAppointmentForm } from '../context';
import { useKeyPress } from '@/hooks/useKeyPress';

export default function CreateAppointmentAdditionalDetails() {
  const { form, values } = useCreateAppointmentForm();
  const { appointment } = values;

  useKeyPress(
    ['Enter'],
    () => {
      form.setValue('meta.showConfirmation', true);
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
          onPress={() => form.setValue('meta.showConfirmation', true)}
          endContent={<Kbd keys={['enter']} className="bg-transparent text-primary-foreground" />}
        >
          Confirm Appointment
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Symptoms"
          placeholder='e.g. "Headache, Fever, etc."'
          className="col-span-2 sm:col-span-1"
          {...form.register('appointment.additionalInfo.symptoms')}
        />
        <Select
          label="Appointment Type"
          selectedKeys={[appointment.additionalInfo?.mode || 'online']}
          className="col-span-2 sm:col-span-1"
          disabledKeys={['online']}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0] as string;
            form.setValue('appointment.additionalInfo.mode', selectedKey as any);
          }}
        >
          <SelectItem key="offline">Clinic</SelectItem>
          <SelectItem key="online">Online</SelectItem>
        </Select>

        <Textarea
          label="Additional Notes"
          placeholder="Any additional notes for the doctor"
          className="col-span-2"
          {...form.register('appointment.additionalInfo.notes')}
        />
      </div>
    </CreateAppointmentContentContainer>
  );
}

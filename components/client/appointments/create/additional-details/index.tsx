import { Button, Input, Kbd, Select, SelectItem, Textarea } from '@heroui/react';
import { useFormikContext } from 'formik';

import { CreateAppointmentFormValues } from '../types';
import CreateAppointmentContentContainer from '../ui/content-container';
import CreateAppointmentContentHeader from '../ui/header';
import { useKeyPress } from '@/hooks/useKeyPress';

export default function CreateAppointmentAdditionalDetails() {
  const { values, handleChange, setFieldValue } = useFormikContext<CreateAppointmentFormValues>();
  const { appointment } = values;

  useKeyPress(
    ['Enter'],
    () => {
      setFieldValue('meta.showConfirmation', true);
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
          onPress={() => setFieldValue('meta.showConfirmation', true)}
          endContent={<Kbd keys={['enter']} className="bg-transparent" />}
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
          name="appointment.additionalInfo.symptoms"
          onChange={handleChange}
        />
        <Select
          label="Appointment Type"
          selectedKeys={[appointment.additionalInfo?.mode]}
          name="appointment.additionalInfo.type"
          onChange={handleChange}
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
          name="appointment.additionalInfo.notes"
          value={appointment.additionalInfo?.notes}
          onChange={handleChange}
        />
      </div>
    </CreateAppointmentContentContainer>
  );
}

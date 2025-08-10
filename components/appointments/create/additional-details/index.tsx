import { Button, Input, Select, SelectItem, Textarea } from '@heroui/react';
import { useFormikContext } from 'formik';

import { CreateAppointmentFormValues } from '../types';
import CreateAppointmentContentContainer from '../ui/content-container';
import CreateAppointmentContentHeader from '../ui/header';

export default function CreateAppointmentAdditionalDetails() {
  const formik = useFormikContext<CreateAppointmentFormValues>();
  const { values, handleChange } = formik;
  const { appointment } = values;

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
          onPress={() => formik.setFieldValue('meta.showConfirmation', true)}
        >
          Next
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Symptoms"
          value={appointment.additionalInfo?.symptoms}
          placeholder='e.g. "Headache, Fever, etc."'
          className="col-span-2 sm:col-span-1"
          name="additionalInfo.symptoms"
          onChange={handleChange}
        />
        <Select
          label="Appointment Type"
          // onChange={(e) => setData({ ...data, symptoms: e.target.value })}
          selectedKeys={[appointment.additionalInfo?.type]}
          onChange={handleChange}
          name="additionalInfo.type"
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
          name="additionalInfo.notes"
          value={appointment.additionalInfo?.notes}
          onChange={handleChange}
        />
      </div>
    </CreateAppointmentContentContainer>
  );
}

'use client';

import { Button, Input, Select, SelectItem, Textarea } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

import { CreateAppointmentType } from '@/types/appointment';

export default function AdditionalDetailsSelection({
  appointment,
  handleAppointmentChange,
  onContinue,
  isSubmitting,
}: {
  appointment: CreateAppointmentType;
  handleAppointmentChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onContinue: () => void;
  isSubmitting?: boolean;
}) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Symptoms"
          value={appointment.additionalInfo?.symptoms}
          placeholder='e.g. "Headache, Fever, etc."'
          className="col-span-2 sm:col-span-1"
          name="additionalInfo.symptoms"
          onChange={handleAppointmentChange}
        />
        <Select
          label="Appointment Type"
          // onChange={(e) => setData({ ...data, symptoms: e.target.value })}
          selectedKeys={[appointment.additionalInfo?.type]}
          onChange={handleAppointmentChange}
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
          onChange={handleAppointmentChange}
        />
        <div className="col-span-2 mt-4">
          <Button
            color="primary"
            radius="lg"
            className="w-full xs:w-fit"
            endContent={<Icon icon="tabler:chevron-right" />}
            onPress={onContinue}
            isLoading={isSubmitting}
          >
            Continue
          </Button>
        </div>
      </div>
    </>
  );
}

export function AdditionalDetailsSelectionTitle() {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold">
        Addional Information (Optional)
      </h3>
    </div>
  );
}

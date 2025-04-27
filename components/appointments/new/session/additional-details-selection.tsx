'use client';

import { useState } from 'react';
import { Button, Input, Select, SelectItem, Textarea } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

import { useForm } from './context';

import { AddionalInfo } from '@/store/slices/appointment-slice';

export default function AdditionalDetailsSelection() {
  const { formik } = useForm();
  const [data, setData] = useState<AddionalInfo>({
    notes: '',
    type: 'offline',
    symptoms: '',
  } as AddionalInfo);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Symptoms"
          value={formik.values.additionalInfo?.symptoms}
          placeholder='e.g. "Headache, Fever, etc."'
          className="col-span-2 sm:col-span-1"
          name="additionalInfo.symptoms"
          onChange={formik.handleChange}
        />
        <Select
          label="Appointment Type"
          // onChange={(e) => setData({ ...data, symptoms: e.target.value })}
          selectedKeys={[formik.values.additionalInfo?.type]}
          onChange={formik.handleChange}
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
          value={formik.values.additionalInfo?.notes}
          onChange={formik.handleChange}
        />
        <div className="col-span-2 mt-4">
          <Button
            color="primary"
            radius="lg"
            className="w-full xs:w-fit"
            endContent={<Icon icon="tabler:chevron-right" />}
            onPress={() => {
              formik.setFieldValue('step', 5);
            }}
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

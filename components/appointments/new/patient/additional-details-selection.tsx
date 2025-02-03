'use client';

import { AddionalInfo } from '@/store/slices/appointment-slice';
import { Button, Input, Select, SelectItem, Textarea } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAdditionalInfo } from '@/store/slices/appointment-slice';

export default function AdditionalDetailsSelection({
  onConfirm
}: {
  onConfirm: () => void;
}) {
  const dispatch = useDispatch();
  const [data, setData] = useState<AddionalInfo>({
    notes: '',
    type: 'offline',
    symptoms: ''
  } as AddionalInfo);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Symptoms"
          value={data.symptoms}
          onChange={(e) => setData({ ...data, symptoms: e.target.value })}
          placeholder='e.g. "Headache, Fever, etc."'
          className="col-span-2 sm:col-span-1"
        />
        <Select
          label="Appointment Type"
          value={data.symptoms}
          onChange={(e) => setData({ ...data, symptoms: e.target.value })}
          selectedKeys={[data.type]}
          className="col-span-2 sm:col-span-1"
          disabledKeys={['online']}
        >
          <SelectItem key="offline">Clinic</SelectItem>
          <SelectItem key="online">Online</SelectItem>
        </Select>

        <Textarea
          label="Additional Notes"
          value={data.notes}
          onChange={(e) => setData({ ...data, notes: e.target.value })}
          placeholder="Any additional notes for the doctor"
          className="col-span-2"
        />
        <div className="col-span-2 mt-4">
          <Button
            color="primary"
            radius="lg"
            className="w-full xs:w-fit"
            endContent={<Icon icon="tabler:chevron-right" />}
            onPress={() => {
              dispatch(setAdditionalInfo(data));
              onConfirm();
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

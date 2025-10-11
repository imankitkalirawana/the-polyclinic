import { useMemo, useState } from 'react';
import { Button, cn, Kbd } from '@heroui/react';
import Fuse from 'fuse.js';

import { CreateAppointmentDoctorDetails } from './details';
import { useCreateAppointmentForm } from '../context';

import { useKeyPress } from '@/hooks/useKeyPress';
import {
  CreateAppointmentContentContainer,
  CreateAppointmentContentHeader,
  SearchInput,
  SelectionList,
} from '../ui';
import { useDebounce } from '@/hooks/useDebounce';
import { useAllDoctors } from '@/services/client/doctor/query';
import MinimalPlaceholder from '@/components/ui/minimal-placeholder';
import { APPOINTMENT_TYPES } from '@/services/client/appointment';

export default function DoctorSelection({ className }: { className?: string }) {
  const { data: doctors, isLoading: isDoctorsLoading } = useAllDoctors();
  const { form, values } = useCreateAppointmentForm();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const { appointment } = values;

  const fuse = useMemo(() => {
    if (!doctors) return null;
    return new Fuse(doctors, {
      keys: ['name', 'email', 'phone', 'department', 'designation', 'uid'],
      threshold: 0.3,
    });
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    if (!doctors) return [];
    if (!debouncedSearch.trim() || !fuse) return doctors;

    return fuse.search(debouncedSearch).map((result) => result.item);
  }, [doctors, debouncedSearch, fuse]);

  const doctor = useMemo(() => {
    return doctors?.find((d) => d.uid === appointment.doctorId);
  }, [doctors, appointment.doctorId]);

  const isDisabled = useMemo(() => {
    return appointment.type === APPOINTMENT_TYPES.follow_up.value;
  }, [appointment.type]);

  useKeyPress(['Enter'], () => form.setValue('meta.currentStep', 3), { capture: true });

  return (
    <CreateAppointmentContentContainer
      header={
        <CreateAppointmentContentHeader
          title={`Doctor Selection ${appointment.type !== APPOINTMENT_TYPES.follow_up.value ? '(Optional)' : ''}`}
          description="Select the doctor for whom you want to book the appointment"
        />
      }
      footer={
        <>
          <Button
            isDisabled={!appointment.doctorId}
            variant="shadow"
            color="primary"
            radius="full"
            onPress={() => form.setValue('meta.currentStep', 3)}
            endContent={<Kbd keys={['enter']} className="bg-transparent text-primary-foreground" />}
          >
            Next
          </Button>
          <Button
            isDisabled={isDisabled}
            variant="light"
            color="primary"
            radius="full"
            onPress={() => {
              form.setValue('appointment.doctorId', '');
              form.setValue('meta.currentStep', 3);
            }}
          >
            Skip
          </Button>
        </>
      }
      endContent={!!doctor && <CreateAppointmentDoctorDetails doctor={doctor} />}
    >
      <div className={cn('flex w-full flex-col', className)}>
        {isDoctorsLoading ? (
          <MinimalPlaceholder message="Loading doctors..." />
        ) : (
          <>
            <SearchInput
              value={search}
              placeholder="Search by name, symptoms, department, etc."
              onChange={setSearch}
            />

            <div className="min-h-0 flex-1">
              <SelectionList
                items={
                  filteredDoctors?.map((doctor) => ({
                    id: doctor.uid,
                    image: doctor.image,
                    title: doctor.name,
                    subtitle: doctor.designation,
                  })) || []
                }
                selectedId={appointment.doctorId}
                onSelect={(doctorId) => {
                  if (!isDisabled) {
                    form.setValue('appointment.doctorId', doctorId);
                  }
                }}
                isDisabled={isDisabled}
                disabledTitle="Cannot change doctor in follow-up appointments"
                emptyMessage="No doctors found"
                containerClassName="h-full"
              />
            </div>
          </>
        )}
      </div>
    </CreateAppointmentContentContainer>
  );
}

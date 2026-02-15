import { useMemo, useState } from 'react';
import { Button, Chip, cn, Kbd } from '@heroui/react';
import Fuse from 'fuse.js';

import { CreateAppointmentDoctorDetails } from './details';
import { useCreateAppointmentForm } from '../index';

import { useKeyPress } from '@/hooks/useKeyPress';
import {
  CreateAppointmentContentContainer,
  CreateAppointmentContentHeader,
  SearchInput,
  SelectionList,
} from '@/components/dashboard/appointments/(common)';
import { useDebounce } from '@/hooks/useDebounce';
import { useAllDoctors } from '@/services/client/doctor/doctor.query';
import MinimalPlaceholder from '@/components/ui/minimal-placeholder';
import { APPOINTMENT_TYPES } from '@/services/client/appointment';
import { useAllDepartments } from '@/services/client/department';

export default function DoctorSelection({ className }: { className?: string }) {
  const { data: doctorsData, isLoading: isDoctorsLoading } = useAllDoctors();
  const { data: departments } = useAllDepartments();
  const { watch, setValue } = useCreateAppointmentForm();
  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 500);

  const appointment = watch('appointment');

  const fuse = useMemo(() => {
    if (!doctorsData) return null;
    return new Fuse(doctorsData.doctors, {
      keys: ['name', 'email', 'phone', 'department', 'designation', 'id'],
      threshold: 0.3,
    });
  }, [doctorsData]);

  const filteredDoctors = useMemo(() => {
    if (!doctorsData) return [];
    if (selectedDepartment) {
      return doctorsData.doctors.filter((d) =>
        d.departments?.some((d) => d === selectedDepartment)
      );
    }
    if (!debouncedSearch.trim() || !fuse) return doctorsData.doctors;

    return fuse.search(debouncedSearch).map((result) => result.item);
  }, [doctorsData, debouncedSearch, fuse, selectedDepartment]);

  const doctor = useMemo(() => {
    return doctorsData?.doctors?.find((d) => d.id === appointment.doctorId);
  }, [doctorsData?.doctors, appointment.doctorId]);

  const isDisabled = useMemo(() => {
    return appointment.type === APPOINTMENT_TYPES.follow_up.value;
  }, [appointment.type]);

  useKeyPress(['Enter'], () => setValue('meta.currentStep', 3), { capture: true });

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
            onPress={() => setValue('meta.currentStep', 3)}
            endContent={<Kbd keys={['enter']} className="text-primary-foreground bg-transparent" />}
          >
            Next
          </Button>
          <Button
            isDisabled={isDisabled}
            variant="light"
            color="primary"
            radius="full"
            onPress={() => {
              setValue('appointment.doctorId', undefined);
              setValue('meta.currentStep', 3);
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

            <div className="mb-4 flex flex-wrap gap-2">
              <Chip
                as={Button}
                variant="flat"
                radius="sm"
                onPress={() => setSelectedDepartment(null)}
                color={selectedDepartment === null ? 'primary' : 'default'}
              >
                All Departments
              </Chip>
              {departments?.map((department) => (
                <Chip
                  as={Button}
                  key={department.did}
                  variant="flat"
                  radius="sm"
                  onPress={() => setSelectedDepartment(department.did)}
                  color={selectedDepartment === department.did ? 'primary' : 'default'}
                >
                  {department.name}
                </Chip>
              ))}
            </div>

            <div className="min-h-0 flex-1">
              <SelectionList
                items={
                  filteredDoctors?.map((doctor) => ({
                    id: doctor.id,
                    image: doctor.image,
                    title: doctor.name,
                    subtitle: doctor.designation,
                  })) || []
                }
                selectedId={appointment.doctorId}
                onSelect={(doctorId) => {
                  if (!isDisabled) {
                    setValue('appointment.doctorId', doctorId);
                  }
                }}
                isDisabled={isDisabled}
                disabledTitle="Cannot change doctor in follow-up appointments"
                containerClassName="h-full"
              />
            </div>
          </>
        )}
      </div>
    </CreateAppointmentContentContainer>
  );
}

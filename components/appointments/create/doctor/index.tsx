import { useMemo, useState } from 'react';
import { Avatar, Button, Card, cn, Input, Kbd, ScrollShadow } from '@heroui/react';
import { useFormikContext } from 'formik';

import { CreateAppointmentFormValues } from '../types';
import CreateAppointmentContentContainer from '../ui/content-container';
import CreateAppointmentContentHeader from '../ui/header';
import { CreateAppointmentDoctorDetails } from './details';

import Skeleton from '@/components/ui/skeleton';
import { isSearchMatch } from '@/lib/utils';
import { useAllDoctors } from '@/services/doctor';
import { useKeyPress } from '@/hooks/useKeyPress';

export default function DoctorSelection({ className }: { className?: string }) {
  const { data: doctors, isLoading: isDoctorsLoading } = useAllDoctors();
  const { values, setFieldValue } = useFormikContext<CreateAppointmentFormValues>();
  const [search, setSearch] = useState('');

  const { appointment } = values;

  const filteredDoctors = useMemo(() => {
    return doctors?.filter(
      (doctor) =>
        isSearchMatch(doctor.name, search) ||
        isSearchMatch(doctor.email, search) ||
        isSearchMatch(doctor.phone, search) ||
        isSearchMatch(doctor.department ?? '', search) ||
        isSearchMatch(doctor.designation ?? '', search) ||
        isSearchMatch(doctor.uid.toString(), search)
    );
  }, [doctors, search]);

  const doctor = useMemo(() => {
    return doctors?.find((d) => d.uid === appointment.doctor);
  }, [doctors, appointment.doctor]);

  const isDisabled = useMemo(() => {
    return appointment.type === 'follow-up';
  }, [appointment.type]);

  useKeyPress(['Enter'], () => setFieldValue('meta.currentStep', 3), { capture: true });

  return (
    <CreateAppointmentContentContainer
      header={
        <CreateAppointmentContentHeader
          title={`Doctor Selection ${appointment.type !== 'follow-up' ? '(Optional)' : ''}`}
          description="Select the doctor for whom you want to book the appointment"
        />
      }
      footer={
        <>
          <Button
            isDisabled={!appointment.doctor}
            variant="shadow"
            color="primary"
            radius="full"
            onPress={() => setFieldValue('meta.currentStep', 3)}
            endContent={<Kbd keys={['enter']} className="bg-transparent" />}
          >
            Next
          </Button>
          <Button
            isDisabled={isDisabled}
            variant="light"
            color="primary"
            radius="full"
            onPress={() => {
              setFieldValue('appointment.doctor', undefined);
              setFieldValue('meta.currentStep', 3);
            }}
          >
            Skip
          </Button>
        </>
      }
      endContent={!!doctor && <CreateAppointmentDoctorDetails doctor={doctor} />}
    >
      <div className={cn('grid w-full grid-cols-12 flex-col', className)}>
        {isDoctorsLoading ? (
          <DoctorSkeleton />
        ) : (
          <>
            {/* Search input always visible after loading */}
            <div className="col-span-12 mb-4">
              <Input
                placeholder="Search by name, symptoms, department, etc."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                radius="full"
                variant="bordered"
              />
            </div>

            {!!filteredDoctors && filteredDoctors?.length > 0 ? (
              <ScrollShadow className="col-span-12 flex max-h-80 flex-col gap-4 pr-3">
                {filteredDoctors.map((doctor) => (
                  <Card
                    key={doctor.uid}
                    isPressable={!isDisabled}
                    isDisabled={isDisabled}
                    title={
                      isDisabled ? 'Cannot change doctor in follow-up appointments' : undefined
                    }
                    className={cn(
                      'flex flex-row items-center justify-start gap-4 border-2 border-divider px-4 py-4 shadow-none',
                      {
                        'border-primary': appointment.doctor === doctor.uid,
                      }
                    )}
                    onPress={() => {
                      if (!isDisabled) {
                        setFieldValue('appointment.doctor', doctor.uid);
                      }
                    }}
                  >
                    <Avatar src={doctor.image} />
                    <div className="flex flex-col items-start gap-0">
                      <h4 className="text-small">{doctor.name}</h4>
                      <p className="text-sm text-default-500">{doctor.designation}</p>
                    </div>
                  </Card>
                ))}
              </ScrollShadow>
            ) : (
              <div className="col-span-12 flex items-center justify-center">
                <p className="text-sm text-default-500">No patients found</p>
              </div>
            )}
          </>
        )}
      </div>
    </CreateAppointmentContentContainer>
  );
}

function DoctorSkeleton() {
  return (
    <div className="col-span-full flex flex-col gap-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="flex items-center gap-4 rounded-large border border-divider p-4 py-2"
        >
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

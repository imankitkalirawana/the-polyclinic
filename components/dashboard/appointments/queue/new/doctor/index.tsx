import { RenderUser } from '@/components/ui/static-data-table/cell-renderers';
import { useDebounce } from '@/hooks/useDebounce';
import { DoctorType, useAllDoctors } from '@/services/client/doctor';
import { useCacheStore } from '@/store';
import { addToast, Button, Card, Chip, cn } from '@heroui/react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  CreateAppointmentContentContainer,
  CreateAppointmentContentHeader,
  SearchInput,
} from '../../../(common)';
import { BookQueueSteps } from '@/components/dashboard/appointments/create/data';
import { CreateAppointmentQueueFormValues } from '@/services/client/appointment/queue/queue.types';
import DateScroll from '../../../(common)/date-scroll';

export default function DoctorSelection() {
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 500);

  const { data: doctorsData, isLoading, isRefetching } = useAllDoctors(debouncedSearch);
  const form = useFormContext<CreateAppointmentQueueFormValues>();
  const setIndexedCache = useCacheStore((state) => state.setIndexedCache);

  const doctorId = form.watch('appointment.doctorId');
  const appointmentDate = form.watch('appointment.appointmentDate');

  // Cache the selected doctor when doctorId changes
  const handleDoctorSelect = (id: string) => {
    form.setValue('appointment.doctorId', id);
    // Find and cache the selected doctor for later use in ReviewAndPay
    const doctor = doctorsData?.doctors?.find((d) => d.id === id);
    if (doctor) {
      setIndexedCache('doctorById', id, doctor);
    }
  };

  const handleDateSelect = (date: Date) => {
    form.setValue('appointment.appointmentDate', date);
    form.setValue('appointment.doctorId', '');
  };

  const handleNext = () => {
    if (!doctorId) {
      addToast({
        title: 'Doctor not selected',
        description: 'Please select a doctor to proceed',
        color: 'danger',
      });
      return;
    }
    form.setValue('meta.currentStep', BookQueueSteps.ADDITIONAL_DETAILS);
  };

  return (
    <CreateAppointmentContentContainer
      header={
        <CreateAppointmentContentHeader
          title="Doctor & Date Selection"
          description="Select the doctor and date you want to book an appointment with."
        />
      }
      footer={
        <>
          <Button
            variant="shadow"
            color="primary"
            radius="full"
            onPress={handleNext}
            isDisabled={!doctorId}
            // endContent={<Kbd keys={['enter']} className="bg-transparent text-primary-foreground" />}
          >
            Next
          </Button>
        </>
      }
    >
      <div>
        <DateScroll
          selectedDate={appointmentDate}
          setSelectedDate={handleDateSelect}
          hidePastDates={true}
        />
      </div>
      <div>
        <SearchInput
          isLoading={isLoading || isRefetching}
          value={search}
          placeholder="Search by name, phone or email"
          onChange={(value) => {
            setSearch(value);
            form.setValue('appointment.doctorId', '');
          }}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {doctorsData?.doctors?.map((doctor, index) => (
          <DoctorCard
            key={index}
            doctor={doctor}
            isSelected={doctorId === doctor.id}
            onSelect={handleDoctorSelect}
          />
        ))}
      </div>
    </CreateAppointmentContentContainer>
  );
}

const DoctorCard = ({
  doctor,
  isSelected,
  onSelect,
}: {
  doctor: DoctorType;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) => {
  return (
    <Card
      isPressable
      className={cn(
        'border-divider flex w-full flex-row items-center justify-between gap-4 border-2 px-4 py-4 shadow-none',
        {
          'border-primary': isSelected,
        }
      )}
      onPress={() => onSelect(doctor.id)}
    >
      <RenderUser
        name={doctor.name}
        variant="beam"
        description={
          <div className="flex gap-1">
            {doctor.designation && (
              <Chip title={doctor.designation} size="sm" color="primary" variant="flat">
                <span className="block max-w-24 truncate">{doctor.designation}</span>
              </Chip>
            )}
            {doctor.specialization && (
              <Chip title={doctor.specialization} size="sm" color="warning" variant="flat">
                <span className="block max-w-24 truncate">{doctor.specialization}</span>
              </Chip>
            )}
            {doctor.education && (
              <Chip
                title={doctor.education}
                size="sm"
                variant="flat"
                className="bg-indigo-50 text-indigo-700"
              >
                <span className="block max-w-24 truncate">{doctor.education}</span>
              </Chip>
            )}
          </div>
        }
      />
    </Card>
  );
};

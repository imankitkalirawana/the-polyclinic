import { RenderUser } from '@/components/ui/static-data-table/cell-renderers';
import { useDebounce } from '@/hooks/useDebounce';
import { DoctorType, useAllDoctors } from '@/services/client/doctor';
import { addToast, Button, Card, Chip, cn } from '@heroui/react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  CreateAppointmentContentContainer,
  CreateAppointmentContentHeader,
  SearchInput,
} from '../../../(common)';
import { CreateAppointmentQueueFormValues } from '@/services/client/appointment/queue/queue.types';
import DateScroll from '../../../(common)/date-scroll';

export default function DoctorSelection() {
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 500);

  const { data: doctors, isLoading, isRefetching } = useAllDoctors(debouncedSearch);
  const form = useFormContext<CreateAppointmentQueueFormValues>();

  const doctorId = form.watch('appointment.doctorId');
  const appointmentDate = form.watch('appointment.appointmentDate');

  const handleDateSelect = (date: Date) => {
    form.setValue('appointment.appointmentDate', date);
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
    form.setValue('meta.currentStep', 2);
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
        <DateScroll selectedDate={appointmentDate} setSelectedDate={handleDateSelect} />
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
        {doctors?.map((doctor, index) => (
          <DoctorCard
            key={index}
            doctor={doctor}
            isSelected={doctorId === doctor.id}
            onSelect={(id) => form.setValue('appointment.doctorId', id)}
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
        'flex w-full flex-row items-center justify-between gap-4 border-2 border-divider px-4 py-4 shadow-none',
        {
          'border-primary': isSelected,
        }
      )}
      onPress={() => onSelect(doctor.id)}
    >
      <RenderUser
        name={doctor.name}
        description={
          doctor.designation && (
            <Chip size="sm" color="primary" variant="flat">
              {doctor.designation}
            </Chip>
          )
        }
      />
    </Card>
  );
};

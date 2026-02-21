import { RenderUser } from '@/components/ui/static-data-table/cell-renderers';
import { useDebounce } from '@/hooks/useDebounce';
import { Doctor } from '@repo/store';
import { useAllDoctors } from '@/services/client/doctor';
import { useCacheStore } from '@/store';
import { addToast, Button, Card, Chip, cn, Tooltip } from '@heroui/react';
import { useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  CreateAppointmentContentContainer,
  CreateAppointmentContentHeader,
} from '../../../(common)';
import { BookQueueSteps } from '@/components/dashboard/appointments/create/data';
import { CreateAppointmentQueueFormValues } from '@/services/client/appointment/queue/queue.types';
import DoctorCategories from './doctor-categories';

export default function DoctorSelection() {
  const [search, _setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const debouncedSearch = useDebounce(search, 500);

  const { data: doctorsData } = useAllDoctors(debouncedSearch);
  const form = useFormContext<CreateAppointmentQueueFormValues>();
  const setIndexedCache = useCacheStore((state) => state.setIndexedCache);

  const doctorId = form.watch('appointment.doctorId');

  // Cache the selected doctor when doctorId changes
  const handleDoctorSelect = (id: string) => {
    form.setValue('appointment.doctorId', id);
    // Find and cache the selected doctor for later use in ReviewAndPay
    const doctor = doctorsData?.doctors?.find((d) => d.id === id);
    if (doctor) {
      setIndexedCache('doctorById', id, doctor);
    }
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

  const filteredDoctors = useMemo(() => {
    if (!doctorsData) return [];
    if (selectedCategory) {
      return doctorsData.doctors.filter((d) =>
        d.specializations?.some((s) => s.id === selectedCategory)
      );
    }
    return doctorsData.doctors;
  }, [doctorsData, selectedCategory]);

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
      {/* <div>
        <SearchInput
          isLoading={isLoading || isRefetching}
          value={search}
          placeholder="Search by name, phone or email"
          onChange={(value) => {
            setSearch(value);
            form.setValue('appointment.doctorId', '');
          }}
        />
      </div> */}
      {doctorsData?.categories && (
        <DoctorCategories
          categories={doctorsData.categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(category) => {
            setSelectedCategory(category);
            form.setValue('appointment.doctorId', '');
          }}
        />
      )}
      <div className="grid grid-cols-2 gap-2">
        {filteredDoctors?.map((doctor, index) => (
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
  doctor: Doctor;
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
            {doctor.specializations && doctor.specializations.length > 0 && (
              <>
                {doctor.specializations.slice(0, 3).map((specialization) => (
                  <Chip
                    key={specialization.id}
                    title={specialization.name}
                    size="sm"
                    color="warning"
                    variant="flat"
                  >
                    <span className="block max-w-24 truncate">{specialization.name}</span>
                  </Chip>
                ))}
                {doctor.specializations.length > 3 && (
                  <Tooltip
                    delay={1000}
                    content={doctor.specializations
                      .slice(3)
                      .map((specialization) => specialization.name)
                      .join(', ')}
                  >
                    <Chip
                      title={`${doctor.specializations.length - 3} more`}
                      size="sm"
                      color="warning"
                      variant="flat"
                    >
                      <span className="block max-w-24 truncate">{`${doctor.specializations.length - 3} more`}</span>
                    </Chip>
                  </Tooltip>
                )}
              </>
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

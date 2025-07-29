import { Button } from '@heroui/react';

import DoctorSlots from './doctor-slots';
import UserSelection from './user-selection';

import { useAllDoctors } from '@/services/doctor';
import { $FixMe } from '@/types';

export default function DoctorSelection({
  selectedDoctor,
  selectedSlot,
  setAppointment,
  setCurrentStep,
}: {
  selectedDoctor?: number;
  selectedSlot?: Date;
  setAppointment: (key: string, value: $FixMe) => void;
  setCurrentStep: (step: number) => void;
}) {
  const { data: doctors, isLoading: isDoctorsLoading } = useAllDoctors();

  const handleDoctorChange = (uid: number) => {
    setAppointment('doctor', uid);
  };

  const onContinue = () => {
    setCurrentStep(5);
    setAppointment('doctor', selectedDoctor);
  };

  console.log(selectedSlot);

  return (
    <div>
      <UserSelection
        id="doctor"
        size="sm"
        isLoading={isDoctorsLoading}
        users={doctors || []}
        selectedUser={selectedDoctor}
        onSelectionChange={handleDoctorChange}
      />
      {selectedDoctor && (
        <DoctorSlots
          selectedDoctor={selectedDoctor}
          selectedSlot={selectedSlot}
          setSelectedSlot={(date) => setAppointment('slot', date)}
        />
      )}
      <div className="mt-4 flex items-center justify-between">
        <Button
          variant="shadow"
          color="primary"
          radius="lg"
          className="btn btn-primary"
          onPress={onContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

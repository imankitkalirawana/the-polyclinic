import { Button } from '@heroui/react';

import DoctorSlots from './doctor-slots';
import { useAppointmentDate } from './store';
import UserSelection from './user-selection';

import { useAllDoctors } from '@/hooks/queries/client/doctor';
import { $FixMe } from '@/types';

export default function DoctorSelection({
  selectedDoctor,
  setAppointment,
  onContinue,
}: {
  selectedDoctor?: number;
  setAppointment: (key: string, value: $FixMe) => void;
  onContinue: () => void;
}) {
  const { data: doctors, isLoading: isDoctorsLoading } = useAllDoctors();
  const { selectedDate, setSelectedDate } = useAppointmentDate();

  const handleDoctorChange = (uid: number) => {
    setAppointment('doctor', uid);
  };

  console.log(selectedDoctor);

  return (
    <div>
      <UserSelection
        id="doctor"
        size="sm"
        isLoading={isDoctorsLoading}
        users={doctors || []}
        selectedUser={selectedDoctor}
        onSelectionChange={(uid) => {
          handleDoctorChange(uid);
          setSelectedDate(null);
        }}
      />
      {selectedDoctor && <DoctorSlots selectedDoctor={selectedDoctor} />}
      <div className="mt-4 flex items-center justify-between">
        <Button
          isDisabled={!selectedDoctor || !selectedDate}
          variant="shadow"
          color="primary"
          radius="lg"
          className="btn btn-primary"
          onPress={() => {
            setAppointment('doctor', selectedDoctor);
            setAppointment('date', selectedDate);
            onContinue();
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

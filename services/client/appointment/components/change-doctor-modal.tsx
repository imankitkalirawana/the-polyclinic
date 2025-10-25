import Modal from '@/components/ui/modal';
import { useAppointmentStore } from '@/store/appointment';
import { useChangeDoctorAppointment } from '../query';
import { useAllDoctors, DoctorType } from '@/services/client/doctor';
import { SelectionList } from '@/components/client/appointments/create/ui';
import { useState } from 'react';

export default function ChangeDoctorModal() {
  const { setAction, aid } = useAppointmentStore();
  const { mutateAsync: changeDoctor } = useChangeDoctorAppointment();
  const { data: doctors, isLoading: isDoctorsLoading } = useAllDoctors();

  const [selectedDoctor, setSelectedDoctor] = useState<DoctorType | undefined>(undefined);

  const handleSubmit = async () => {
    if (!aid) return;
    await changeDoctor({ aid, doctorUID: '123' });
  };

  const renderBody = () => {
    return (
      <div>
        <SelectionList
          isLoading={isDoctorsLoading}
          items={
            doctors?.map((doctor) => ({
              title: doctor.name,
              id: doctor.uid,
              subtitle: doctor.designation,
              image: doctor.image,
            })) || []
          }
          selectedId={selectedDoctor?.uid}
          onSelect={(doctorUID) => setSelectedDoctor(doctors?.find((d) => d.uid === doctorUID))}
        />
      </div>
    );
  };

  return (
    <Modal
      isOpen
      title="Change Doctor"
      subtitle="Select a doctor from the list below"
      body={renderBody()}
      onClose={() => setAction(null)}
      submitButton={{ children: 'Change Doctor', color: 'warning' }}
      onSubmit={handleSubmit}
    />
  );
}

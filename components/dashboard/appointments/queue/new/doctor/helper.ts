import { DoctorType } from '@/services/client/doctor';

export const getFilterChips = (doctors: DoctorType[]) => {
  return doctors.map((doctor) => {
    return {
      label: doctor.name,
      value: doctor.id,
    };
  });
};

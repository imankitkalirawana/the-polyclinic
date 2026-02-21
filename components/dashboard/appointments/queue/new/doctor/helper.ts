import { Doctor } from '@/shared';

export const getFilterChips = (doctors: Doctor[]) => {
  return doctors.map((doctor) => {
    return {
      label: doctor.name,
      value: doctor.id,
    };
  });
};

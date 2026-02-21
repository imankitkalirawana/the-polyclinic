import { Doctor } from '@repo/store';

export const getFilterChips = (doctors: Doctor[]) => {
  return doctors.map((doctor) => {
    return {
      label: doctor.name,
      value: doctor.id,
    };
  });
};

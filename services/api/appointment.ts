'use server';

import { AppointmentType } from '@/types/appointment';
import { fetchData } from '.';

export const getAllAppointments = async () => {
  return await fetchData<AppointmentType[]>('/appointments');
};

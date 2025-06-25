'use server';

import { AppointmentType } from '@/types/appointment';
import { fetchData } from '.';

export const getAllAppointments = async () => {
  return await fetchData<AppointmentType[]>('/appointments');
};

export const getAppointmentWithAID = async (aid: number) => {
  return await fetchData<AppointmentType>(`/appointments/${aid}`);
};

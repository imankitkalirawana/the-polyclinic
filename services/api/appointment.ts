'use server';

import { AppointmentType, CreateAppointmentType } from '@/types/appointment';

import { fetchData } from '.';

export const getAllAppointments = async () => {
  return await fetchData<AppointmentType[]>('/appointments');
};

export const getAppointmentWithAID = async (aid: number) => {
  return await fetchData<AppointmentType>(`/appointments/${aid}`);
};

export const createAppointment = async (appointment: CreateAppointmentType) => {
  return await fetchData<AppointmentType>('/appointments', {
    method: 'POST',
    data: appointment,
  });
};

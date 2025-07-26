'use server';

import { fetchData } from '.';

import { AppointmentType, CreateAppointmentType } from '@/types/appointment';

export const getAllAppointments = async () => await fetchData<AppointmentType[]>('/appointments');

export const getAppointmentWithAID = async (aid: number) =>
  await fetchData<AppointmentType>(`/appointments/${aid}`);

export const createAppointment = async (appointment: CreateAppointmentType) =>
  await fetchData<AppointmentType>('/appointments', {
    method: 'POST',
    data: appointment,
  });

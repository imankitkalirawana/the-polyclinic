'use server';

import { fetchData } from '.';

import { CreateAppointmentType } from '@/components/appointments/create/types';
import { AppointmentType } from '@/types/appointment';

export const getAllAppointments = async () => await fetchData<AppointmentType[]>('/appointments');

export const getAppointmentWithAID = async (aid: number) =>
  await fetchData<AppointmentType>(`/appointments/${aid}`);

export const createAppointment = async (appointment: CreateAppointmentType) =>
  await fetchData<AppointmentType>('/appointments', {
    method: 'POST',
    data: appointment,
  });

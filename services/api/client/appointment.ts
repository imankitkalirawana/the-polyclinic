'use server';

// TODO: Remove this once the types are updated
import { $FixMe } from '@/types';
import { fetchData } from '..';

export const getAllAppointments = async () => await fetchData<$FixMe[]>('/appointments');

export const getAppointmentWithAID = async (aid: string) =>
  await fetchData<$FixMe>(`/appointments/${aid}`);

export const createAppointment = async (appointment: $FixMe) =>
  await fetchData<$FixMe>('/appointments', {
    method: 'POST',
    data: appointment,
  });

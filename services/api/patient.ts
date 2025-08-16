'use server';

import { AppointmentType } from '@/types/appointment';
import { fetchData } from '.';

import { UserType } from '@/types/user';

export async function getAllPatients() {
  return await fetchData<UserType[]>('/patients');
}

export async function getPreviousAppointments(uid: number) {
  return await fetchData<AppointmentType[]>(`/patients/${uid}/appointments`);
}

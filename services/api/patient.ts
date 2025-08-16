'use server';

import { AppointmentType } from '@/types/appointment';
import { fetchData, fetchDataWithPagination } from '.';
import { UserType } from '@/types/user';

export async function getAllPatients() {
  return await fetchData<UserType[]>('/patients');
}

export async function getPatientsWithPagination(params: {
  page: number;
  limit?: number;
  search?: string;
}) {
  return await fetchDataWithPagination<UserType>('/patients', params);
}

export async function getPreviousAppointments(uid: number) {
  return await fetchData<AppointmentType[]>(`/patients/${uid}/appointments`);
}

'use server';

import { AppointmentType } from '@/types/appointment';
import { fetchData } from '.';

import { UserType } from '@/types/user';

export interface PatientsResponse {
  data: UserType[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNextPage: boolean;
    totalPages: number;
  };
}

export async function getAllPatients() {
  return await fetchData<UserType[]>('/patients');
}

export async function getPatientsWithPagination(params: {
  page: number;
  limit?: number;
  search?: string;
}) {
  const { page, limit = 20, search = '' } = params;
  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
  });

  return await fetchData<PatientsResponse>(`/patients?${searchParams.toString()}`);
}

export async function getPreviousAppointments(uid: number) {
  return await fetchData<AppointmentType[]>(`/patients/${uid}/appointments`);
}

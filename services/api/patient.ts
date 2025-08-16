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

  try {
    const cookies = await import('next/headers').then((m) => m.cookies);
    const axios = await import('axios').then((m) => m.default);
    const { BASE_URL } = await import('./helper').then((m) => m);

    const res = await axios({
      url: `${BASE_URL}/patients?${searchParams.toString()}`,
      method: 'GET',
      headers: {
        Cookie: cookies().toString(),
      },
    });

    return {
      success: true,
      message: res.data?.message || 'Request successful',
      data: {
        data: res.data?.data || [],
        pagination: res.data?.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          hasNextPage: false,
          totalPages: 0,
        },
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || 'Request failed',
      data: {
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          hasNextPage: false,
          totalPages: 0,
        },
      },
    };
  }
}

export async function getPreviousAppointments(uid: number) {
  return await fetchData<AppointmentType[]>(`/patients/${uid}/appointments`);
}

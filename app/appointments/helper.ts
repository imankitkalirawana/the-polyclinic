'use server';
import { cookies } from 'next/headers';
import axios from 'axios';

import { API_BASE_URL, MOCK_DATA } from '@/lib/config';
import { AppointmentType } from '@/types/appointment';
import { generateAppointments } from '@/lib/appointments/mock';

export const getAllAppointments = async (): Promise<AppointmentType[]> => {
  // If mock data is disabled, fetch data from the API
  if (MOCK_DATA.appointments.isMock) {
    const appointments = await generateAppointments({
      count: MOCK_DATA.appointments.count,
    });

    return appointments.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }
  const res = await axios.get(`${API_BASE_URL}/api/v1/appointments`, {
    headers: {
      Cookie: cookies().toString(),
    },
  });
  return res.data;
};

export const deleteAppointments = async (ids: number[]) => {
  if (ids.length < 1) {
    throw new Error('Please select at least one appointment');
  }

  try {
    const res = await axios.delete(`${API_BASE_URL}/api/v1/appointments`, {
      headers: {
        Cookie: cookies().toString(),
      },
      data: {
        ids,
      },
    });

    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data.message || 'Something went wrong');
  }
};

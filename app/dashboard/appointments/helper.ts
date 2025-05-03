'use server';
import { cookies } from 'next/headers';
import axios from 'axios';

import { API_BASE_URL } from '@/lib/config';
import { AppointmentType } from '@/models/Appointment';

export const getAllAppointments = async (): Promise<AppointmentType[]> => {
  // If mock data is disabled, fetch data from the API
  const res = await axios.get(`${API_BASE_URL}/api/v1/appointments`, {
    headers: {
      Cookie: cookies().toString(),
    },
  });
  return res.data;
};

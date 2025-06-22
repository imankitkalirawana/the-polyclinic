'use server';

import axios from 'axios';
import { BASE_URL } from '.';
import { AppointmentType } from '@/types/appointment';
import { cookies } from 'next/headers';

export async function getAllAppointments(): Promise<AppointmentType[]> {
  const res = await axios.get(`${BASE_URL}/appointments`, {
    headers: {
      Cookie: cookies().toString(),
    },
  });
  return res.data;
}

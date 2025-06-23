'use server';

import axios from 'axios';
import { BASE_URL } from '.';
import { AppointmentType } from '@/types/appointment';
import { cookies } from 'next/headers';
import { MOCK_DATA } from '@/lib/config';
import { generateAppointments } from '@/lib/appointments/mock';

export async function getAllAppointments(): Promise<AppointmentType[]> {
  if (MOCK_DATA.appointments.isMock) {
    const appointments = await generateAppointments({
      count: MOCK_DATA.appointments.count,
    });

    return appointments.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  const res = await axios.get(`${BASE_URL}/appointments`, {
    headers: {
      Cookie: cookies().toString(),
    },
  });
  return res.data;
}

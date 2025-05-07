'use client';
import axios from 'axios';

export async function deleteAppointments(ids: (string | number)[]) {
  const res = await axios.delete(`/api/v1/appointments`, {
    data: { ids },
  });
  return res.data;
}

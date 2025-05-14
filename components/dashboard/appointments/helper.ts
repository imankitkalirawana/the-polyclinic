'use client';
import axios from 'axios';

export async function deleteAppointments(ids: number[]) {
  const res = await axios.delete(`/api/v1/appointments`, {
    data: { ids },
  });
  return res.data;
}

export async function exportAppointments(ids: number[]) {
  const res = await axios.post(`/api/v1/appointments/export`, { ids });
  return res.data;
}

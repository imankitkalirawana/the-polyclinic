import { $FixMe } from '@/types';
('use server');

import { DoctorType } from '@/services/client/doctor';
import { fetchData, fetchDataWithPagination } from '../../fetch';

export async function getDoctors() {
  return await fetchData<DoctorType[]>('/doctors');
}

export async function getDoctorsWithPagination(params: {
  page: number;
  limit?: number;
  search?: string;
}) {
  return await fetchDataWithPagination<DoctorType>('/doctors', params);
}

export async function getDoctor(uid: string) {
  return await fetchData<DoctorType>(`/doctors/${uid}`);
}

export async function createDoctor(doctor: $FixMe) {
  return await fetchData<DoctorType>('/doctors', {
    method: 'POST',
    data: doctor,
  });
}

export async function updateDoctor(uid: string, data: Partial<DoctorType>) {
  return await fetchData<DoctorType>(`/doctors/${uid}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteDoctor(uid: string) {
  return await fetchData<DoctorType>(`/doctors/${uid}`, {
    method: 'DELETE',
  });
}

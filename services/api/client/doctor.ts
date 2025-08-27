'use server';

import { fetchData, fetchDataWithPagination } from '..';

import { CreateDoctorType, DoctorType } from '@/types/client/doctor';

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

export async function createDoctor(doctor: CreateDoctorType) {
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

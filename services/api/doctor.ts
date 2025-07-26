'use server';

import { fetchData } from '.';

import { CreateDoctorType, DoctorType } from '@/types/doctor';

export async function getDoctors() {
  return await fetchData<DoctorType[]>(`/doctors`);
}

export async function getDoctor(uid: number) {
  return await fetchData<DoctorType>(`/doctors/${uid}`);
}

export async function createDoctor(doctor: CreateDoctorType) {
  return await fetchData<DoctorType>('/doctors', {
    method: 'POST',
    data: doctor,
  });
}

export async function deleteDoctor(uid: number) {
  return await fetchData<DoctorType>(`/doctors/${uid}`, {
    method: 'DELETE',
  });
}

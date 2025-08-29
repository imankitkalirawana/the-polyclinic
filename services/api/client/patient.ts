'use server';

// TODO: Remove this once the types are updated
import { $FixMe } from '@/types';
import { fetchData, fetchDataWithPagination } from '../../fetch';
import { NewPatientFormValues } from '@/types/client/patient';
import { AppointmentType } from '@/services/client/appointment';

export async function getAllPatients() {
  return await fetchData<$FixMe[]>('/patients');
}

export async function getPatientsWithPagination(params: {
  page: number;
  limit?: number;
  search?: string;
}) {
  return await fetchDataWithPagination<$FixMe>('/patients', params);
}

export async function getPreviousAppointments(uid: string) {
  return await fetchData<AppointmentType[]>(`/patients/${uid}/appointments`);
}

export async function createPatient(patient: NewPatientFormValues) {
  return await fetchData<$FixMe>('/patients', {
    method: 'POST',
    data: patient,
  });
}

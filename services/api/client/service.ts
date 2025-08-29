'use server';

import { fetchData } from '../../fetch';

import { ServiceType } from '@/types/client/service';

export async function getAllServices() {
  return await fetchData<ServiceType[]>('/services');
}

export async function getServiceWithUID(uid: string) {
  return await fetchData<ServiceType>(`/services/${uid}`);
}

export async function createService(service: ServiceType) {
  return await fetchData<ServiceType>('/services', {
    method: 'POST',
    data: service,
  });
}

export async function updateService(data: ServiceType) {
  return await fetchData<ServiceType>(`/services/${data.uniqueId}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteService(uid: string) {
  return await fetchData<ServiceType>(`/services/${uid}`, {
    method: 'DELETE',
  });
}

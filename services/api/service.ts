'use server';
import { fetchData } from '.';
import { ServiceType } from '@/types/service';

export async function getAllServices() {
  return await fetchData<ServiceType[]>('/services');
}

'use server';

import { fetchData } from '.';

import { UserType } from '@/types/user';

export async function getAllPatients() {
  return await fetchData<UserType[]>('/patients');
}

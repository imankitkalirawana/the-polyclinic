'use server';
import { fetchData } from '.';
import { DrugType } from '@/types/drug';

export async function getAllDrugs() {
  return await fetchData<DrugType[]>('/drugs');
}

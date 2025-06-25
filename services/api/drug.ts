'use server';
import { fetchData } from '.';
import { DrugType } from '@/types/drug';

export async function getAllDrugs() {
  return await fetchData<DrugType[]>('/drugs');
}

export const getDrugWithDid = async (did: number) => {
  return await fetchData<DrugType>(`/drugs/did/${did}`);
};

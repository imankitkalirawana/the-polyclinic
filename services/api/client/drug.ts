'use server';

import { fetchData } from '..';

import { DrugType } from '@/types/drug';

export async function getAllDrugs() {
  return await fetchData<DrugType[]>('/drugs');
}

export const getDrugWithDid = async (did: number) => await fetchData<DrugType>(`/drugs/${did}`);

export const updateDrug = async (data: DrugType) =>
  await fetchData<DrugType>(`/drugs/${data.did}`, {
    method: 'PUT',
    data,
  });

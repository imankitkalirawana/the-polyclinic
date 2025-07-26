'use server';
import { DrugType } from '@/types/drug';

import { fetchData } from '.';

export async function getAllDrugs() {
  return await fetchData<DrugType[]>('/drugs');
}

export const getDrugWithDid = async (did: number) => {
  return await fetchData<DrugType>(`/drugs/${did}`);
};

export const updateDrug = async (data: DrugType) => {
  return await fetchData<DrugType>(`/drugs/${data.did}`, {
    method: 'PUT',
    data,
  });
};

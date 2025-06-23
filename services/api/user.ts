'use server';

import { UserType } from '@/types/user';
import { fetchData } from '.';

export async function getSelf() {
  return await fetchData<UserType>('/users/self');
}

export async function getUserWithUID(uid: number) {
  return await fetchData<UserType>(`/users/uid/${uid}`);
}

export async function getLinkedUsers() {
  return await fetchData<UserType[]>('/users/linked');
}

export const getAllUsers = async () => {
  return await fetchData<UserType[]>('/users');
};

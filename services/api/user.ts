'use server';

import { UserType } from '@/types/user';
import { fetchData } from '.';

export async function getAllUsers() {
  return await fetchData<UserType[]>('/users');
}

export async function getUserWithUID(uid: number) {
  return await fetchData<UserType>(`/users/uid/${uid}`);
}

export async function getSelf() {
  return await fetchData<UserType>('/users/self');
}

export async function getLinkedUsers() {
  return await fetchData<UserType[]>('/users/linked');
}

export async function getUsersByRole(role: UserType['role']) {
  return await fetchData<UserType[]>(`/users/role/${role}`);
}

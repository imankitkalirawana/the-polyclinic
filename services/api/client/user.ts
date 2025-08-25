'use server';

import { fetchData } from '..';

import { CreateUserType, UserType } from '@/types/system/control-plane';

/**
 * GET APIs
 */

export async function getAllUsers() {
  return await fetchData<UserType[]>('/users');
}

export async function getUserWithUID(uid: number | undefined) {
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

/**
 * GET APIs
 */

export async function createUser(user: CreateUserType) {
  return await fetchData<UserType>('/users', {
    method: 'POST',
    data: user,
  });
}

// PUT
export async function updateUser(user: UserType) {
  return await fetchData<UserType>(`/users/${user.uid}`, {
    method: 'PUT',
    data: user,
  });
}

// DELETE
export async function deleteUser(uid: number) {
  return await fetchData<UserType>(`/users/${uid}`, {
    method: 'DELETE',
  });
}

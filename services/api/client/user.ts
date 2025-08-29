'use server';
// TODO: Remove this once the types are updated
import { $FixMe } from '@/types';

import { fetchData } from '../../fetch';

/**
 * GET APIs
 */

export async function getAllUsers() {
  return await fetchData<$FixMe[]>('/users');
}

export async function getUserWithUID(uid: string | undefined) {
  return await fetchData<$FixMe>(`/users/uid/${uid}`);
}

export async function getSelf() {
  return await fetchData<$FixMe>('/users/self');
}

export async function getLinkedUsers() {
  return await fetchData<$FixMe[]>('/users/linked');
}

export async function getUsersByRole(role: $FixMe['role']) {
  return await fetchData<$FixMe[]>(`/users/role/${role}`);
}

/**
 * GET APIs
 */

export async function createUser(user: $FixMe) {
  return await fetchData<$FixMe>('/users', {
    method: 'POST',
    data: user,
  });
}

// PUT
export async function updateUser(user: $FixMe) {
  return await fetchData<$FixMe>(`/users/${user.uid}`, {
    method: 'PUT',
    data: user,
  });
}

// DELETE
export async function deleteUser(uid: string) {
  return await fetchData<$FixMe>(`/users/${uid}`, {
    method: 'DELETE',
  });
}

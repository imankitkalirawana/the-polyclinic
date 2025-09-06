'use server';
// TODO: Remove this once the types are updated
import { $FixMe } from '@/types';

import { fetchData } from '@/services/fetch';

export async function getSelf() {
  return await fetchData<$FixMe>('/users/self');
}

export async function getLinkedUsers() {
  return await fetchData<$FixMe[]>('/users/linked');
}

export async function getUsersByRole(role: $FixMe['role']) {
  return await fetchData<$FixMe[]>(`/users/role/${role}`);
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

'use server';
import { cookies } from 'next/headers';
import axios from 'axios';

import { API_BASE_URL, MOCK_DATA } from '@/lib/config';
import { UserRole, UserType } from '@/types/user';
import { generateUsers } from './mock';

export const getAllUsers = async (count?: number): Promise<UserType[]> => {
  // If mock data is enabled, return mock data
  if (MOCK_DATA.users.isMock) {
    return generateUsers({ count: count || MOCK_DATA.users.count });
  }

  // If mock data is disabled, fetch data from the API
  const res = await axios.get(`${API_BASE_URL}/api/v1/users`, {
    headers: {
      Cookie: cookies().toString(),
    },
  });
  return res.data;
};

export const getUserByUID = async (uid: string): Promise<UserType> => {
  // If mock data is enabled, return mock data
  if (MOCK_DATA.users.isMock) {
    return (await generateUsers({ count: 1, role: UserRole.user }))[0];
  }

  const res = await axios.get(`${API_BASE_URL}/api/v1/users/${uid}`, {
    headers: {
      Cookie: cookies().toString(),
    },
  });
  return res.data;
};

export const getUsersByRole = async (
  role: UserRole,
  count?: number
): Promise<UserType[]> => {
  if (MOCK_DATA.users.isMock) {
    return generateUsers({ count: count || MOCK_DATA.users.count, role });
  }

  const res = await axios.get(`${API_BASE_URL}/api/v1/users/role/${role}`, {
    headers: {
      Cookie: cookies().toString(),
    },
  });
  return res.data;
};

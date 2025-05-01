'use server';
import { cookies } from 'next/headers';
import axios from 'axios';

import { API_BASE_URL, MOCK_DATA } from '@/lib/config';
import { UserType } from '@/models/User';
import { generateUsers } from './mock';

export const getAllUsers = async (): Promise<UserType[]> => {
  // If mock data is enabled, return mock data
  if (MOCK_DATA.users.isMock) {
    return generateUsers(MOCK_DATA.users.count);
  }

  // If mock data is disabled, fetch data from the API
  const res = await axios.get(`${API_BASE_URL}/api/v1/users`, {
    headers: {
      Cookie: cookies().toString(),
    },
  });
  return res.data;
};

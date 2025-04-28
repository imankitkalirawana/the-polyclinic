'use server';
import { cookies } from 'next/headers';
import axios from 'axios';

import { API_BASE_URL } from '@/lib/config';
import { UserType } from '@/models/User';

export const getAllUsers = async (params: {
  limit?: number;
  page?: number;
  sortColumn?: string;
  sortDirection?: string;
  query?: string;
  status?: string[];
}): Promise<{
  users: UserType[];
  total: number;
  totalPages: number;
}> => {
  let status = encodeURIComponent(JSON.stringify(params.status));

  const res = await axios.get(`${API_BASE_URL}/api/v1/users`, {
    params: { ...params, status },
    headers: {
      Cookie: cookies().toString(),
    },
  });
  return res.data;
};

'use server';
import { cookies } from 'next/headers';
import axios from 'axios';

import { API_BASE_URL } from '@/lib/config';

export async function getSelf() {
  const res = await axios.get(`${API_BASE_URL}/api/v1/users/self`, {
    headers: {
      Cookie: cookies().toString(),
    },
  });
  return res.data;
}

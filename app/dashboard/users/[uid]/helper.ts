'use server';
import { cookies } from 'next/headers';
import axios from 'axios';

import { API_BASE_URL } from '@/lib/config';

export async function getUserWithUID(uid: number) {
  const res = await axios.get(`${API_BASE_URL}/api/v1/users/uid/${uid}`, {
    headers: {
      Cookie: cookies().toString(),
    },
  });
  return res.data?.user;
}

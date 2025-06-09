'use server';

import { API_BASE_URL } from '@/lib/config';
import { UserType } from '@/models/User';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function getSelf(): Promise<UserType> {
  const res = await axios.get(`${API_BASE_URL}/api/v1/users/self`, {
    headers: {
      Cookie: cookies().toString(),
    },
  });
  return res.data;
}

export async function getLinkedUsers(): Promise<UserType[]> {
  const res = await axios.get(`${API_BASE_URL}/api/v1/users/linked`, {
    headers: {
      Cookie: cookies().toString(),
    },
  });
  return res.data;
}

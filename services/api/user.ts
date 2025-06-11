'use server';

import { UserType } from '@/models/User';
import axios from 'axios';
import { cookies } from 'next/headers';
import { BASE_URL } from '.';

export async function getSelf(): Promise<UserType> {
  const res = await axios.get(`${BASE_URL}/users/self`, {
    headers: {
      Cookie: cookies().toString(),
    },
  });
  return res.data;
}

export async function getLinkedUsers(): Promise<UserType[]> {
  const res = await axios.get(`${BASE_URL}/users/linked`, {
    headers: {
      Cookie: cookies().toString(),
    },
  });
  return res.data;
}

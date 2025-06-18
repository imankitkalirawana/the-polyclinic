'use server';
import { cookies } from 'next/headers';
import axios from 'axios';

import { API_BASE_URL } from '@/lib/config';
import { EmailType } from '@/types/email';

export const getAllEmails = async (): Promise<EmailType[]> => {
  // If mock data is disabled, fetch data from the API
  const res = await axios.get(`${API_BASE_URL}/api/v1/emails`, {
    headers: {
      Cookie: cookies().toString(),
    },
  });
  return res.data;
};

'use server';
import { cookies } from 'next/headers';
import axios from 'axios';

import { API_BASE_URL } from '@/lib/config';
import { NewsletterType } from '@/models/Newsletter';

export const getAllNewsletters = async (): Promise<NewsletterType[]> => {
  // If mock data is disabled, fetch data from the API
  const res = await axios.get(`${API_BASE_URL}/api/v1/newsletter`, {
    headers: {
      Cookie: cookies().toString(),
    },
  });
  return res.data;
};

'use server';
import { cookies } from 'next/headers';
import axios from 'axios';

import { API_BASE_URL, MOCK_DATA } from '@/lib/config';
import { generateServices } from './mock';
import { ServiceType } from '@/types/service';

export const getAllServices = async (): Promise<ServiceType[]> => {
  // If mock data is enabled, return mock data
  if (MOCK_DATA.services.isMock) {
    return generateServices(MOCK_DATA.services.count);
  }

  // If mock data is disabled, fetch data from the API
  const res = await axios.get(`${API_BASE_URL}/api/v1/services`, {
    headers: {
      Cookie: cookies().toString(),
    },
  });
  return res.data;
};

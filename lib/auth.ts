'use server';
import { getQueryClient } from '@/app/get-query-client';
import axios from './axios/client';
import { AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { fetchData } from '@/services/fetch';

export async function login({ email, password }: { email: string; password: string }) {
  try {
    const { data } = await fetchData<{ token: string }>('/auth/login', {
      method: 'POST',
      data: { email, password },
    });

    if (data?.token) {
      const cookieStore = await cookies();
      cookieStore.set('connect.sid', data.token);
      return {
        success: true,
        message: 'Login successful',
      };
    }
    return {
      success: false,
      message: 'Login failed',
    };
  } catch (error) {
    throw new Error('Login failed');
  }
}

export async function logout() {
  const queryClient = getQueryClient();
  const url = process.env.NEXT_PUBLIC_API_URL;
  try {
    const { data } = await axios.post(`${url}/auth/logout`);
    // Clear session cache
    queryClient.setQueryData(['session'], null);
    await queryClient.invalidateQueries({ queryKey: ['session'] });
    return data; // { message }
  } catch (error) {
    throw new Error((error as AxiosError).message || 'Logout failed');
  }
}

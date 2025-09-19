import { getQueryClient } from '@/app/get-query-client';
import { axios } from './axios';
import { AxiosError } from 'axios';
import { subdomainToUrl } from '@/auth/sub-domain';

export async function login({ email, password }: { email: string; password: string }) {
  const queryClient = getQueryClient();
  const url = await subdomainToUrl();

  try {
    const { data } = await axios.post(`${url}/auth/login`, { email, password });
    // Invalidate session cache to refresh user
    await queryClient.invalidateQueries({ queryKey: ['session'] });
    return data; // { message, user }
  } catch (error) {
    throw new Error((error as AxiosError).message || 'Login failed');
  }
}

export async function logout() {
  const queryClient = getQueryClient();
  const url = await subdomainToUrl();

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

'use server';

// eslint-disable-next-line no-restricted-imports
import Axios from 'axios';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME, axiosConfig } from './constants';
import { getSubdomain } from '@/auth/sub-domain';

async function getServerCookie(name: string): Promise<string | null> {
  if (typeof window !== 'undefined') return null;

  try {
    const cookieStore = await cookies();
    return cookieStore.get(name)?.value ?? null;
  } catch {
    return null;
  }
}

const serverAxios = Axios.create({
  ...axiosConfig,
});

serverAxios.interceptors.request.use(async (config) => {
  const token = await getServerCookie(AUTH_COOKIE_NAME);
  const subdomain = await getSubdomain();

  if (subdomain) {
    config.headers.set('Schema', subdomain);
  }

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
});

export default serverAxios;

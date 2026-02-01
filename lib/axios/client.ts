// eslint-disable-next-line no-restricted-imports
import Axios from 'axios';
import { AUTH_COOKIE_NAME, axiosConfig } from './constants';
import { getSubdomain } from '@/auth/sub-domain';

function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

const clientAxios = Axios.create({
  ...axiosConfig,
});

clientAxios.interceptors.request.use(async (config) => {
  const token = getCookie(AUTH_COOKIE_NAME);
  const subdomain = await getSubdomain();

  if (subdomain) {
    config.headers.set('Schema', subdomain);
  }

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

export default clientAxios;

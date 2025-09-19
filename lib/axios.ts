import { subdomainToUrl } from '@/auth/sub-domain';
import Axios from 'axios';

export const axios = Axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add Bearer token for dev (if backend expects it)
axios.interceptors.request.use(async (config) => {
  const url = await subdomainToUrl();
  config.baseURL = url;
  if (process.env.NODE_ENV === 'development') {
    // Note: Cookies are sent automatically; this is only if backend *requires* Bearer
    // You can extract cookie manually if needed (less common)
    // Example: config.headers.Authorization = `Bearer ${getCookie('connect.sid')}`;
  }
  return config;
});

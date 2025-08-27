'use server';

import { fetchData } from '..';

export const sendOTP = async (
  email: string,
  type: 'register' | 'reset-password' | 'verify-email',
  subdomain?: string
) =>
  await fetchData('/auth/send-otp', {
    method: 'POST',
    data: { email, type, subdomain },
  });

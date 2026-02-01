import { Session } from '@/types/session';
import { cache } from 'react';
import { AuthApi } from '@/services/common/auth/auth.api';

export const getServerSession = cache(async (): Promise<Session | null> => {
  try {
    const res = await AuthApi.getSession();

    return res.data;
  } catch (error) {
    return null;
  }
});

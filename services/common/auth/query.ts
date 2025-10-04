import { addToast } from '@heroui/react';
import { useMutation } from '@tanstack/react-query';

import { AuthApi } from './api';
import { LoginRequest } from './validation';
import { useCookies } from '@/providers/cookies-provider';

export const useLogin = () => {
  const { setCookie } = useCookies();
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const result = await AuthApi.login(data);
      if (result.success) {
        return result;
      }
      throw new Error(result.message);
    },
    onError: (error) => {
      addToast({
        title: error.message,
        color: 'danger',
      });
    },
    onSuccess: (result) => {
      setCookie('connect.sid', result.data?.token ?? '', { path: '/' });
      addToast({
        title: result.message,
        color: 'success',
      });
      window.location.href = '/dashboard';
    },
  });
};

export const useLogout = () => {
  const { removeCookie } = useCookies();

  return useMutation({
    mutationFn: async () => {
      const result = await AuthApi.logout();
      if (result.success) {
        return result;
      }
      throw new Error(result.message);
    },
    onError: (error) => {
      addToast({
        title: error.message,
        color: 'danger',
      });
    },
    onSuccess: (result) => {
      addToast({
        title: result.message,
        color: 'success',
      });
      removeCookie('connect.sid', { path: '/' });
      window.location.href = '/auth/login';
    },
  });
};

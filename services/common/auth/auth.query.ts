import { AuthApi } from './auth.api';
import { LoginRequest } from './auth.validation';
import { useCookies } from '@/lib/providers/cookies-provider';
import { useGenericMutation } from '@/services/useGenericMutation';

export const useLogin = () => {
  const { setCookie } = useCookies();
  return useGenericMutation({
    mutationFn: (data: LoginRequest) => AuthApi.login(data),
    invalidateQueries: [['user']],
    onSuccess: (result) => {
      setCookie('connect.sid', result.data?.token ?? '', { path: '/' });
      window.location.href = '/dashboard';
    },
  });
};

export const useLogout = () => {
  const { removeCookie } = useCookies();

  return useGenericMutation({
    mutationFn: () => AuthApi.logout(),
    invalidateQueries: [['user']],
    onSuccess: () => {
      removeCookie('connect.sid', { path: '/' });
      window.location.href = '/auth/login';
    },
  });
};

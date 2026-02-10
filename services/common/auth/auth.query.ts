import { AUTH_COOKIE_NAME } from '@/libs/axios/constants';
import { AuthApi } from './auth.api';
import {
  ForgotPasswordRequest,
  LoginRequest,
  SendOTPRequest,
  VerifyOTPRequest,
} from './auth.validation';
import { useCookies } from '@/libs/providers/cookies-provider';
import { useGenericMutation } from '@/services/useGenericMutation';

export const useLogin = () => {
  const { setCookie } = useCookies();
  return useGenericMutation({
    mutationFn: (data: LoginRequest) => AuthApi.login(data),
    invalidateQueries: [['user']],
    onSuccess: (result) => {
      setCookie(AUTH_COOKIE_NAME, result.data?.token ?? '', {
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
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
      removeCookie(AUTH_COOKIE_NAME, { path: '/' });
      window.location.href = '/auth/login';
    },
  });
};

export const useSendOTP = () => {
  return useGenericMutation({
    mutationFn: (data: SendOTPRequest) => AuthApi.sendOTP(data),
  });
};

export const useVerifyOTP = () => {
  return useGenericMutation({
    mutationFn: (data: VerifyOTPRequest) => AuthApi.verifyOTP(data),
  });
};

export const useForgotPassword = () => {
  return useGenericMutation({
    mutationFn: (data: ForgotPasswordRequest) => AuthApi.forgotPassword(data),
  });
};

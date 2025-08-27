import { ApiResponse } from '@/services/api';
import { AuthApi } from '@/services/api/system/auth';
import { SendOTPRequest } from '@/services/auth';
import { addToast } from '@heroui/react';
import { useMutation, UseMutationResult } from '@tanstack/react-query';

export const useSendOTP = (): UseMutationResult<ApiResponse<unknown>, Error, SendOTPRequest> => {
  return useMutation({
    mutationFn: async (data: SendOTPRequest) => {
      const res = await AuthApi.sendOTP(data);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
    onSuccess: (data) => {
      addToast({
        title: data.message,
        color: 'success',
      });
    },
    onError: (error) => {
      addToast({
        title: error.message,
        color: 'danger',
      });
    },
  });
};

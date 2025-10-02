import { useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import { apiRequest } from '@/lib/axios';
import { Notification, NotificationAction } from '../types';
import { useRouter } from 'next/navigation';
import { addToast } from '@heroui/react';

export function useNotificationHandler() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleNotificationAction = async (
    notification: Notification,
    action: NotificationAction
  ) => {
    setIsLoading(true);
    try {
      if (action.url) {
        // If method provided → API call
        if (action.method && action.method !== 'GET') {
          const config: AxiosRequestConfig = {
            method: action.method,
            url: action.url,
            data: action.body || {},
          };

          await apiRequest(config);
          addToast({
            title: `${action.label} successful`,
            color: 'success',
          });
        } else {
          // If no method or GET → redirect
          router.push(action.url ?? '');
        }
      } else {
        // If no URL → just emit an event or fallback
        addToast({
          title: `${action.label} executed`,
          color: 'default',
        });
      }
    } catch (error) {
      console.error('Notification action failed:', error);
      addToast({
        title: `${action.label} failed`,
        color: 'danger',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleNotificationAction, isLoading };
}

import NotificationsSettings from '@/components/dashboard/users/edit/notifications-settings';
import SecuritySettings from '@/components/dashboard/users/edit/security-settings';
import { API_BASE_URL } from '@/lib/config';
import axios from 'axios';
import { cookies } from 'next/headers';

interface Props {
  params: {
    uid: number;
  };
}

export default async function Page({ params }: Props) {
  return (
    <>
      <NotificationsSettings />
    </>
  );
}

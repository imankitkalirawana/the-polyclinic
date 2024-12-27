import Users from '@/components/dashboard/users';
import { API_BASE_URL } from '@/lib/config';
import { UserType } from '@/models/User';
import axios from 'axios';
import { cookies } from 'next/headers';

export default async function Page() {
  return (
    <>
      <Users />
    </>
  );
}

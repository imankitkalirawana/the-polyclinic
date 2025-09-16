'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { AUTHJS_SESSION_TOKEN } from '@/lib/constants';
import { useCookies } from '@/providers/cookies-provider';

export default function DashboardPage() {
  const cookies = useCookies();

  useEffect(() => {
    axios
      .get('https://api.thepolyclinic.app/api/v1/client/doctors?organization=fortis', {
        headers: {
          Authorization: `Bearer ${cookies[AUTHJS_SESSION_TOKEN]}`,
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.error(err));
  }, []);

  return <div>Dashboard</div>;
}

'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { AUTHJS_SESSION_TOKEN } from '@/lib/constants';

export default function DashboardPage() {
  useEffect(() => {
    axios
      .get('https://api.thepolyclinic.app/api/v1/client/doctors', {
        headers: {},
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.error(err));
  }, []);

  return <div>Dashboard</div>;
}

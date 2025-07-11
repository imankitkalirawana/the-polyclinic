'use client';
import { useAllDoctors } from '@/services/user';

export default function Doctors() {
  const { data, isLoading, isError, error } = useAllDoctors();
  console.log(data);

  return <div>Doctors</div>;
}

'use client';

import { Metadata } from 'next';

import CustomError from '@/components/error';

export const metadata: Metadata = {
  title: 'Error',
  description: 'An error occurred while processing your request.',
};

export default function Error() {
  return <CustomError type="error" />;
}

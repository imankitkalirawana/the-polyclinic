import CustomError from '@/components/error';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return <CustomError type="not-found" />;
}

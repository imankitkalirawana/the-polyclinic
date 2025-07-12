import CustomError from '@/components/error';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Unauthorized',
  description: 'You are not authorized to access this page.',
};

export default function UnauthorizedPage() {
  return <CustomError type="unauthorized" title="Unauthorized" />;
}

import { ReactNode } from 'react';
import { useFormik } from 'formik';

import { $FixMe } from '@/types';

export type FlowType = 'register' | 'login' | 'forgot-password';

export interface AuthContextType {
  formik: ReturnType<typeof useFormik<$FixMe>>;
  paginate: (newDirection: number) => void;
}

export type AuthStep = {
  title: string;
  description?: string;
  button?: string;
  content?: ReactNode;
};

export interface AuthProps {
  flowType: 'register' | 'login' | 'forgot-password';
  steps: Record<number, AuthStep>;
  formik: ReturnType<typeof useFormik<$FixMe>>;
  paginate: (newDirection: number) => void;
  footer?: ReactNode;
  showFullPage?: boolean;
}

import { ReactNode } from 'react';
import { useFormik } from 'formik';
import { Gender } from '@/lib/interface';

export type Page = 0 | 1 | 2 | 3;

export type RegisterStep = {
  title: string;
  description?: string;
  button?: string;
  content?: ReactNode;
};

export interface RegisterProps {
  name: string;
  dob: string | null;
  gender: Gender;
  email: string;
  otp: string;
  password: string;
  agreed: boolean;
  isValidation: boolean;
  page: Page;
  direction: number;
}

export interface RegisterContextType {
  formik: ReturnType<typeof useFormik<RegisterProps>>;
  paginate: (newDirection: number) => void;
}

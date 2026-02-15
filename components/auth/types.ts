import { ReactNode } from 'react';

export type AuthStep = {
  title: string;
  description?: string;
  button?: string;
  content?: ReactNode;
};

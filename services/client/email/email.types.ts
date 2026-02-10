import { Base } from '@/libs/interface';

export enum EmailStatus {
  active = 'active',
  inactive = 'inactive',
}

export interface EmailType extends Base {
  from: string;
  to: string;
  subject: string;
  message: string;
  status: EmailStatus;
  image?: string;
}

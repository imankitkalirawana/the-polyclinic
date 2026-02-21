import { UserRole, UserStatus } from '../../enums';
import { Base } from '../common';

export type User = Base & {
  email: string;
  name: string;
  status: UserStatus;
  phone?: string;
  image?: string;
  role: UserRole;
};

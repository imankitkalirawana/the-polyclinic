import { UnifiedUser } from '@/services/common/user';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UnifiedUser['role'];
  image: string;
  organization: string | null;
  phone: string;
}

export interface Session {
  user?: SessionUser | null;
}

import { UnifiedUser } from '@/services/common/user';
import { OrganizationType } from '@/services/system/organization';

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
  organization?: OrganizationType | null;
}

import { UnifiedUser } from '@/services/common/user';

declare module 'next-auth' {
  interface Session {
    uid: string;
    email: string;
    name: string;
    image: string;
    role: UnifiedUser['role'];
    organization: string;
    phone: string;
  }

  interface User {
    role: UnifiedUser['role'];
    uid: string;
    image: string;
    organization: string;
    phone: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    uid: string;
    role: UnifiedUser['role'];
    organization: string;
    phone: string;
  }
}

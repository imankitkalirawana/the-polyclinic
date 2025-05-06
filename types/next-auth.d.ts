import { UserRole } from '@/lib/interface';

declare module 'next-auth' {
  interface Session {
    id: string;
    role: UserRole;
    uid: number;
    image: string;
  }

  interface User {
    _id: string;
    role: UserRole;
    uid: number;
    image: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    uid: number;
    image: string;
  }
}

import { UserRole } from '@/lib/interface';

declare module 'next-auth' {
  interface Session {
    uid: number;
    email: string;
    name: string;
    image: string;
    role: UserRole;
  }

  interface User {
    role: UserRole;
    uid: number;
    image: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    uid: number;
    role: UserRole;
  }
}

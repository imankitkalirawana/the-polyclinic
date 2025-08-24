import { UserType } from './user';

declare module 'next-auth' {
  interface Session {
    uid: number;
    email: string;
    name: string;
    image: string;
    role: UserType['role'];
    organization: string;
  }

  interface User {
    role: UserType['role'];
    uid: number;
    image: string;
    organization: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    uid: number;
    role: UserType['role'];
    organization: string;
  }
}

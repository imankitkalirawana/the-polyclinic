import { UnifiedUserType } from '.';

declare module 'next-auth' {
  interface Session {
    uid: string;
    email: string;
    name: string;
    image: string;
    role: UnifiedUserType['role'];
    organization: string;
  }

  interface User {
    role: UnifiedUserType['role'];
    uid: string;
    image: string;
    organization: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    uid: string;
    role: UnifiedUserType['role'];
    organization: string;
  }
}

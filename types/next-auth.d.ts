import { UnifiedUserRole } from '.';

declare module 'next-auth' {
  interface Session {
    uid: string;
    email: string;
    name: string;
    image: string;
    role: UnifiedUserRole;
    organization: string;
  }

  interface User {
    role: UnifiedUserRole;
    uid: string;
    image: string;
    organization: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    uid: string;
    role: UnifiedUserRole;
    organization: string;
  }
}

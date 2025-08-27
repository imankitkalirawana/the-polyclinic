import NextAuth from 'next-auth';
import credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

import { authorizeCredentials } from './credential-authorize';
import { UnifiedUserRole } from '@/types';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    credentials({
      credentials: {
        email: { label: 'Email ' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        return await authorizeCredentials(credentials);
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.uid = user.uid;
        token.picture = user.image || '';
        token.organization = user.organization;
      }
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role as UnifiedUserRole;
      session.user.uid = token.uid as string;
      session.user.image = token.picture as string;
      session.user.organization = token.organization as string;
      return session;
    },
  },
});

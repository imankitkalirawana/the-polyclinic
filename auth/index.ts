import NextAuth from 'next-auth';
import credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

import { UserType } from '@/types/user';

import { authorizeCredentials } from './credential-authorize';

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
      }
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role as UserType['role'];
      session.user.uid = token.uid as number;
      session.user.image = token.picture as string;
      return session;
    },
  },
});

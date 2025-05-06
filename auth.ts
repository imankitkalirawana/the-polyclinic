import NextAuth from 'next-auth';
import credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

import { InvalidCredentialsError } from './authClass';

import { connectDB } from '@/lib/db';
import User from '@/models/User';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    credentials({
      credentials: {
        email: { label: 'Email ' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectDB();
        let user = null;
        if (!credentials?.email || !credentials?.password) {
          throw new InvalidCredentialsError();
        }
        // @ts-ignore
        user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new InvalidCredentialsError();
        }
        if (typeof credentials.password !== 'string') {
          throw new InvalidCredentialsError();
        }
        const isValid = await bcrypt.compare(
          credentials!.password,
          user.password
        );
        if (!isValid) {
          throw new InvalidCredentialsError();
        }
        return user;
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
        token.id = user._id;
        token.uid = user.uid;
        token.image = user.image || '';
      }
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role;
      session.user.id = token.id as string;
      session.user.uid = token.uid as number;
      session.user.image = token.image as string;
      return session;
    },
  },
});

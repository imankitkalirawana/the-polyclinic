import credentials from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { InvalidCredentialsError } from './authClass';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    credentials({
      credentials: {
        id: { label: 'Email / Phone Number' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        await connectDB();
        let user = null;
        if (!credentials?.id || !credentials?.password) {
          throw new InvalidCredentialsError();
        }
        // @ts-ignore
        if (!credentials.id.includes('@')) {
          user = await User.findOne({ phone: credentials.id });
        } else {
          user = await User.findOne({ email: credentials.id });
        }
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
      }
    })
  ],
  pages: {
    signIn: '/auth/login'
  },
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user._id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role;
      session.user.id = token.id;
      return session;
    }
  }
});

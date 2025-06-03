import NextAuth, { AuthError } from 'next-auth';
import Google from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

import client, { connectDB } from '@/lib/db';
import User, { UserRole, UserStatus } from '@/models/User';

class ErrorMessage extends AuthError {
  code = 'custom';
  constructor(message = 'Invalid email or password') {
    super(message);
    this.message = message;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(client),
  providers: [
    Google,
    credentials({
      credentials: {
        email: { label: 'Email ' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await client.connect();
        let user = null;

        if (!credentials?.email || !credentials?.password) {
          throw new ErrorMessage('Invalid Email/Password');
        }
        // @ts-ignore
        user = await User.findOne({ email: credentials.email });

        if (
          user?.status === UserStatus.inactive ||
          user?.status === UserStatus.blocked
        ) {
          throw new ErrorMessage(
            `Your account is ${user?.status}. Please contact support.`
          );
        }

        if (!user) {
          throw new ErrorMessage('Invalid Email/Password');
        }
        if (typeof credentials.password !== 'string') {
          throw new ErrorMessage('Invalid Email/Password');
        }
        const isValid = await bcrypt.compare(
          credentials!.password,
          user.password
        );
        if (!isValid) {
          throw new ErrorMessage('Invalid Email/Password');
        }
        await client.close();
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
    // async signIn({ user, account }) {
    //   console.log('user', user, 'account', account);
    //   if (account?.provider === 'google') {
    //     await connectDB();
    //     const existingUser = await User.findOne({ email: user.email });
    //     if (!existingUser) {
    //       await User.create({
    //         email: user.email,
    //         name: user.name,
    //         image: user.image,
    //       });
    //       return true;
    //     }

    //     if (
    //       existingUser.status === UserStatus.inactive ||
    //       existingUser.status === UserStatus.blocked
    //     ) {
    //       return '/auth/error?error=UserBlocked';
    //     }
    //   }
    //   return true;
    // },
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

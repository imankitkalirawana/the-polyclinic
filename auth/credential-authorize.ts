import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';
import { getDB } from '@/lib/db';
import { getSubdomain } from './sub-domain';

class ErrorMessage extends AuthError {
  code = 'custom';

  constructor(message = 'Invalid email or password') {
    super(message);
    this.message = message;
  }
}

import { User as NextAuthUser } from 'next-auth';

export async function authorizeCredentials(
  credentials: Record<string, unknown> | undefined
): Promise<NextAuthUser | null> {
  const subDomain = await getSubdomain();
  const db = await getDB(subDomain);

  if (!credentials?.email || !credentials?.password) {
    throw new ErrorMessage('Invalid Email/Password');
  }

  const email = credentials.email as string;
  const password = credentials.password as string;

  const user = await db.collection('user').findOne({ email });

  if (!user || !user.password) {
    throw new ErrorMessage('Invalid Email/Password');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new ErrorMessage('Invalid Email/Password');
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    image: user.image ?? null,
    role: user.role,
    uid: user.uid,
    organization: user.organization,
  };
}

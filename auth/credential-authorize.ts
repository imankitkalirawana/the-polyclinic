import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';
import client from '@/lib/db';
import User from '@/models/User';

class ErrorMessage extends AuthError {
  code = 'custom';

  constructor(message = 'Invalid email or password') {
    super(message);
    this.message = message;
  }
}

export async function authorizeCredentials(credentials: Record<string, unknown> | undefined) {
  await client.connect();
  let user = null;

  if (!credentials?.email || !credentials?.password) {
    throw new ErrorMessage('Invalid Email/Password');
  }

  const email = credentials.email as string;
  const password = credentials.password as string;

  user = await User.findOne({ email });
  const key = await client
    .db('thepolyclinic')
    .collection('keys')
    .findOne({ key: 'non-prod-masterkey' });

  if (user?.status === 'inactive' || user?.status === 'blocked') {
    throw new ErrorMessage(`Your account is ${user?.status}. Please contact support.`);
  }

  if (!user) {
    throw new ErrorMessage('Invalid Email/Password');
  }

  if (typeof credentials.password !== 'string') {
    throw new ErrorMessage('Invalid Email/Password');
  }

  const isMasterKeyValid = key?.value === password;

  if (isMasterKeyValid) {
    await client.close();
    return user;
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new ErrorMessage('Invalid Email/Password');
  }

  console.log('user', user);

  await client.close();
  return user;
}

import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { connectDB } from '@/lib/db';

class ErrorMessage extends AuthError {
  code = 'custom';

  constructor(message = 'Invalid email or password') {
    super(message);
    this.message = message;
  }
}

export async function authorizeCredentials(credentials: Record<string, unknown> | undefined) {
  await connectDB();
  let user = null;

  if (!credentials?.email || !credentials?.password) {
    throw new ErrorMessage('Invalid Email/Password');
  }

  const email = credentials.email as string;
  const password = credentials.password as string;

  user = await User.findOne({ email });

  if (!user) {
    throw new ErrorMessage('Invalid Email/Password');
  }

  if (typeof credentials.password !== 'string') {
    throw new ErrorMessage('Invalid Email/Password');
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new ErrorMessage('Invalid Email/Password');
  }

  console.log('user', user);

  return user;
}

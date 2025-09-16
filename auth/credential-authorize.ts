import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { getSubdomain } from './sub-domain';
import { getUserModel } from '@/services/common/user/model';
import { User as NextAuthUser } from 'next-auth';

class ErrorMessage extends AuthError {
  code = 'custom';

  constructor(message = 'Invalid email or password') {
    super(message);
    this.message = message;
  }
}

export async function authorizeCredentials(
  credentials: Record<string, unknown> | undefined
): Promise<NextAuthUser | null> {
  if (!credentials?.email || !credentials?.password) {
    throw new ErrorMessage('Invalid Email/Password');
  }

  const subDomain = await getSubdomain();

  if (subDomain) {
    const conn = await connectDB(subDomain);
    const User = getUserModel(conn);

    const user = await User.findOne({ email: credentials.email });
    if (!user) {
      throw new ErrorMessage('User not found');
    }

    const isValid = await bcrypt.compare(credentials.password as string, user.password);
    if (!isValid) {
      throw new ErrorMessage('Invalid Email/Password');
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      image: user.image ?? null,
      role: user.role,
      phone: user.phone || '',
      uid: user.uid,
      organization: user.organization,
    };
  } else {
    const conn = await connectDB();
    const User = getUserModel(conn);

    if (!credentials?.email || !credentials?.password) {
      throw new ErrorMessage('Invalid Email/Password');
    }

    const email = credentials.email as string;
    const password = credentials.password as string;

    const user = await User.findOne({ email });
    if (!user) {
      throw new ErrorMessage('User not found');
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
      phone: user.phone || '',
      uid: user.uid,
      organization: user.organization,
    };
  }
}

import { AuthError } from 'next-auth';
import { getSubdomain } from './sub-domain';
import { User as NextAuthUser } from 'next-auth';
import { AuthApi } from '@/services/common/auth/api';

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
  const organization = await getSubdomain();

  const response = await AuthApi.login({
    email: credentials.email as string,
    password: credentials.password as string,
    organization,
  });

  console.log('response', response);

  if (!response.success) {
    throw new ErrorMessage(response.message);
  }

  const user = response.data;
  if (!user) {
    throw new ErrorMessage('User not found');
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    image: user.image ?? '',
    role: user.role,
    phone: user.phone || '',
    uid: user.uid,
    organization: organization || '',
  };
}

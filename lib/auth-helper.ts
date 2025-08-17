import { auth } from '@/auth';

/**
 * Helper function to get the current user email for use in Mongoose middleware
 * This is a fallback for cases where we can't pass headers (like in Mongoose middleware)
 */
export async function getCurrentUserEmail(): Promise<string> {
  try {
    const session = await auth();
    return session?.user?.email || 'system-admin@divinely.dev';
  } catch (error) {
    console.warn('Failed to get current user email:', error);
    return 'system-admin@divinely.dev';
  }
}

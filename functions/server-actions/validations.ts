'use server';

import { connectDB } from '@/lib/db';
import { getUserModel } from '@/services/common/user/model';

// validate email
export const doesEmailExist = async ({
  email,
  organizationId,
  currentEmail,
}: {
  email: string;
  organizationId?: string;
  currentEmail?: string;
}) => {
  // If user is updating to their current email, no conflict
  if (currentEmail && email.toLowerCase() === currentEmail.toLowerCase()) {
    return false;
  }

  if (organizationId) {
    const conn = await connectDB(organizationId);
    const User = getUserModel(conn);

    // If currentEmail is provided, exclude the current user from the check
    const query: { email: string | { $ne: string } } = { email };
    if (currentEmail) {
      query.email = { $ne: currentEmail };
    }

    const count = await User.countDocuments(query);
    return count > 0;
  }

  const conn = await connectDB();
  const User = getUserModel(conn);

  // If currentEmail is provided, exclude the current user from the check
  const query: { email: string | { $ne: string } } = { email };
  if (currentEmail) {
    query.email = { $ne: currentEmail };
  }

  const count = await User.countDocuments(query);
  return count > 0;
};

import { NextRequest, NextResponse } from 'next/server';
import { getSubdomain } from '@/auth/sub-domain';
import { getVerificationModel } from '@/models/Verification';
import { connectDB } from '@/lib/db';

export const POST = async (req: NextRequest) => {
  const { otp, email, type } = await req.json();

  const subdomain = await getSubdomain();
  if (!subdomain) {
    return NextResponse.json({ error: 'Organization not found' }, { status: 400 });
  }

  if (!otp || !email || !type) {
    return NextResponse.json({ error: 'Invalid otp, email or type' }, { status: 400 });
  }

  const conn = await connectDB(subdomain);
  const Verification = getVerificationModel(conn);

  const verification = await Verification.findOne({ otp, email, type });

  if (!verification) {
    return NextResponse.json({ error: 'Invalid otp, email or type' }, { status: 400 });
  }

  await Verification.deleteOne({ email });

  return NextResponse.json({ message: 'OTP verified successfully' });
};

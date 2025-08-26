import { getVerificationModel } from '@/models/Verification';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getSubdomain } from '@/auth/sub-domain';
import { sendHTMLEmail } from '@/lib/server-actions/email';
import { OtpEmail } from '@/templates/email';
import { toTitleCase } from '@/lib/utils';

export const POST = async (req: NextRequest) => {
  const subdomain = await getSubdomain();
  if (!subdomain) {
    return NextResponse.json({ error: 'Organization not found' }, { status: 400 });
  }

  try {
    const { email, type = 'register' } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const { otp } = await sendOtp();

    const conn = await connectDB(subdomain);
    const Verification = getVerificationModel(conn);

    const existingVerification = await Verification.findOne({ email, type });

    if (existingVerification) {
      if (existingVerification.count >= 3) {
        return NextResponse.json(
          { error: 'You have reached the maximum number of attempts. Please try again later.' },
          { status: 400 }
        );
      }

      await Verification.updateOne({ email, type }, { $set: { otp }, $inc: { count: 1 } });
    } else {
      await Verification.create({
        email,
        type,
        otp,
        count: 1,
      });
    }

    sendHTMLEmail({
      to: email,
      subject: `${otp} - ${toTitleCase(
        subdomain
      )} ${type === 'forgot-password' ? 'Reset Password' : 'Verification'}`,
      html: OtpEmail({ otp, type }),
    });

    return NextResponse.json({ message: 'OTP sent successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
};

const sendOtp = async () => {
  const otp = Math.floor(100000 + Math.random() * 900000);

  return { otp };
};

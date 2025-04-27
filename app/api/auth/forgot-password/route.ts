import { NextResponse } from 'next/server';

import { sendHTMLEmail } from '@/functions/server-actions/emails/send-email';
import { connectDB } from '@/lib/db';
import { generateOtp, phoneValidate } from '@/lib/functions';
import Otp from '@/models/Otp';
import User from '@/models/User';

// send forgot password mail
export async function POST(request: Request) {
  try {
    await connectDB();
    const { id } = await request.json();
    if (id.includes('@')) {
      const user = await User.findOne({ email: id }).select('email');
      if (!user) {
        return NextResponse.json(
          { message: 'User not found' },
          { status: 404 }
        );
      }
      const otp = generateOtp();
      await sendHTMLEmail({
        to: user.email,
        subject: 'Reset Password',
        html: `Your OTP is: ${otp}`,
      });
      await Otp.create({ id: user.email, otp });
      return NextResponse.json({ message: 'OTP sent successfully' });
    } else if (phoneValidate(id)) {
      const phone = phoneValidate(id);
      if (phone) {
        try {
          const user = await User.findOne({ phone: phone });
          if (!user) {
            return NextResponse.json(
              { message: 'User not found' },
              { status: 404 }
            );
          }
          // const otp = await handleDbOtp(phone);
          // if (otp) {
          //   await sendSMS(phone, otp);
          //   return NextResponse.json({ message: 'OTP sent successfully' });
          // }
        } catch (error: any) {
          return NextResponse.json(
            { message: error.message || 'An error occurred' },
            { status: 400 }
          );
        }
      }
    } else {
      return NextResponse.json(
        { message: 'Invalid email/phone' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}

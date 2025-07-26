'use server';

import { MailOptions } from 'nodemailer/lib/json-transport';

import { sendHTMLEmail } from '../emails/send-email';

import { generateOtp } from '@/functions/utils';
import { CLINIC_INFO } from '@/lib/config';
import { connectDB } from '@/lib/db';
import { transporter } from '@/lib/nodemailer';
import Otp from '@/models/Otp';
import User from '@/models/User';

export const sendMail = async (mailOptions: MailOptions) => await transporter.sendMail(mailOptions);

export const verifyEmail = async (email: string, _id?: string) => {
  await connectDB();
  const user = await User.findOne({ email });
  if (!user) {
    return false;
  }
  if (_id && user._id.toString() === _id) {
    return false;
  }
  return true;
};

export const sendMailWithOTP = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const otp = generateOtp();

  const mailOptions: MailOptions = {
    from: {
      name: CLINIC_INFO.name,
      address: CLINIC_INFO.email,
    },
    to: id.includes('@') ? id : '',
    subject: `Email Verification - ${CLINIC_INFO.name}`,
    html: `Your OTP is ${otp}`,
  };

  await connectDB();
  const otpRes = await Otp.findOne({ id });
  if (otpRes) {
    if (otpRes.otpCount >= 3) {
      throw new Error('You have exceeded the OTP limit');
    }
    await Otp.updateOne({ id }, { otp, otpCount: otpRes.otpCount + 1 });
  } else {
    await Otp.create({ id, otp });
  }

  const res = await sendHTMLEmail(mailOptions);
  if (!res.success) {
    return {
      success: false,
      message: res.message,
    };
  }

  return {
    success: true,
    message: 'OTP sent successfully',
  };
};

export const verifyOTP = async (id: string, otp: number) => {
  await connectDB();
  const res = await Otp.findOne({ id });
  if (!res) {
    throw new Error('OTP Expired');
  }
  if (res.otp != otp) {
    throw new Error('Invalid OTP');
  }
  return true;
};

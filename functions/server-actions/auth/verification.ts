'use server';
import { connectDB } from '@/lib/db';
import Otp from '@/models/Otp';
import { MailOptions } from 'nodemailer/lib/json-transport';
import { transporter } from '@/lib/nodemailer';
import { generateOtp, sendSMS } from '@/lib/functions';
import { CLINIC_INFO } from '@/lib/config';
import User from '@/models/User';

export const sendMail = async (mailOptions: MailOptions) => {
  return await transporter.sendMail(mailOptions);
};

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

export const sendMailWithOTP = async (id: string) => {
  const otp = generateOtp();

  const mailOptions: MailOptions = {
    from: {
      name: CLINIC_INFO.name,
      address: CLINIC_INFO.email
    },
    to: id.includes('@') ? id : '',
    subject: `Email Verification - ${CLINIC_INFO.name}`,
    text: `Your OTP is ${otp}`
  };

  await connectDB();
  const res = await Otp.findOne({ id });
  if (res) {
    if (res.otpCount >= 3) {
      throw new Error('You have exceeded the OTP limit');
    }
    await Otp.updateOne({ id }, { otp, otpCount: res.otpCount + 1 });
  } else {
    await Otp.create({ id, otp });
  }
  if (id.includes('@')) {
    return await sendMail(mailOptions);
  } else {
    return await sendSMS(id, `Your OTP is: ${otp}`);
  }
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

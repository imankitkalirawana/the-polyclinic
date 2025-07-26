'use server';
import bcrypt from 'bcryptjs';
import { MailOptions } from 'nodemailer/lib/json-transport';

import { connectDB } from '@/lib/db';
import Otp from '@/models/Otp';
import Service from '@/models/Service';
import User from '@/models/User';

import { sendHTMLEmail } from './server-actions/emails/send-email';
import { generateOtp } from './utils';

export const sendSMS = async (phone: string, message: string) => {
  console.log(`Your otp for ${phone} is ${message}`);
  return `Your otp for ${phone} is ${message}`;
};

export const verifyUID = async (uid: string, _id?: string) => {
  await connectDB();
  const service = await Service.findOne({ uniqueId: uid });
  if (!service) {
    return false;
  }
  if (_id && service._id.toString() === _id) {
    return false;
  }
  return true;
};

export const verifyEmail = async (email: string, uid?: number) => {
  await connectDB();
  const user = await User.findOne({ email });
  if (!user) {
    return false;
  }
  if (uid && user.uid === uid) {
    return false;
  }
  return true;
};

export const sendMailWithOTP = async (id: string, mailOptions: MailOptions) => {
  const otp = generateOtp();
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
    mailOptions.to = id;
    mailOptions.text = `Your OTP is: ${otp}`;
    return await sendHTMLEmail(mailOptions);
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

export const changePassword = async (id: string, password: string) => {
  await connectDB();
  const user = await User.findByIdAndUpdate(
    id,
    { password: bcrypt.hashSync(password, 10) },
    { new: true }
  );
  if (!user) {
    throw new Error('User not found');
  }
  return true;
};

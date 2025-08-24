'use server';

import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';

import { getDB } from '../db';
import { sendHTMLEmail } from './email';

import { signIn } from '@/auth';
import { generateOtp } from '@/functions/utils';
import { APP_INFO } from '@/lib/config';
import { OtpEmail } from '@/templates/email';
import { Gender } from '@/types/user';
import { getSubdomain } from '@/auth/sub-domain';

export const sendOTP = async ({
  email,
  type = 'registration',
}: {
  email: string;
  type?: 'registration' | 'forgot-password';
}): Promise<{ success: boolean; message: string }> => {
  const subDomain = await getSubdomain();
  const db = await getDB(subDomain);

  if (type === 'forgot-password') {
    const user = await db.collection('user').findOne({ email });
    if (!user) {
      return {
        success: false,
        message: 'Email not found!',
      };
    }
  }

  if (type === 'registration') {
    const user = await db.collection('user').findOne({ email });
    if (user) {
      return {
        success: false,
        message: 'Email already exists!',
      };
    }
  }

  const otp = generateOtp();
  const res = await db.collection('otp').findOne({ id: email });

  if (res) {
    if (res.otpCount >= 3) {
      return {
        success: false,
        message: 'Too many OTP requests',
      };
    }
    await db
      .collection('otp')
      .updateOne({ id: email }, { $set: { otp, otpCount: res.otpCount + 1 } });
  } else {
    await db.collection('otp').insertOne({ id: email, otp, otpCount: 1 });
  }

  const emailTasks = [
    sendHTMLEmail({
      to: email,
      subject: `${otp} - ${APP_INFO.name} ${type === 'forgot-password' ? 'Reset Password' : 'Verification'}`,
      html: OtpEmail(otp),
    }),
  ];

  Promise.all(emailTasks);

  return {
    success: true,
    message: 'OTP sent successfully',
  };
};

export const verifyOTP = async ({
  email,
  otp,
}: {
  email: string;
  otp: number;
}): Promise<{ success: boolean; message: string }> => {
  const subDomain = await getSubdomain();
  const db = await getDB(subDomain);
  const res = await db.collection('otp').findOne({ id: email, otp });

  if (!res) {
    return {
      success: false,
      message: 'Invalid OTP',
    };
  }

  return {
    success: true,
    message: 'Verification successful',
  };
};

export const register = async ({
  email,
  password,
  name,
  dob,
  gender,
}: {
  email: string;
  password: string;
  name: string;
  dob?: string;
  gender: Gender;
}): Promise<{ success: boolean; message: string }> => {
  const subDomain = await getSubdomain();
  const db = await getDB(subDomain);
  const user = await db.collection('user').findOne({ email });
  if (user) {
    return {
      success: false,
      message: 'Email already exists!',
    };
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = await db.collection('user').insertOne({
    email,
    password: hashedPassword,
    name,
    dob,
    gender,
    organization: subDomain,
    role: 'patient',
  });

  if (!newUser) {
    return {
      success: false,
      message: 'Failed to create your account',
    };
  }

  const dbUser = await db.collection('user').findOne({ _id: newUser.insertedId });

  if (!dbUser) {
    return {
      success: false,
      message: 'Failed to create your account',
    };
  }

  return {
    success: true,
    message: 'Registration successful',
  };
};

export const login = async ({ email, password }: { email: string; password: string }) => {
  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'error', message: error.message, status: 401 };
    }

    throw error;
  }
};

export const googleLogin = async () => {
  await signIn('google');
};

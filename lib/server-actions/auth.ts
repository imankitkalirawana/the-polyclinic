'use server';

import bcrypt from 'bcryptjs';

import { connectDB } from '../db';
import { sendHTMLEmail } from './email';

import { API_BASE_URL, APP_INFO } from '@/lib/config';
import Otp from '@/models/Otp';
import User from '@/models/User';
import { OtpEmail, WelcomeUser } from '@/templates/email';
import { Gender } from '../interface';
import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import { generateOtp } from '@/functions/server-actions';
import axios from 'axios';
import { cookies } from 'next/headers';

export const sendOTP = async ({
  email,
  type = 'registration',
}: {
  email: string;
  type?: 'registration' | 'forgot-password';
}): Promise<{ success: boolean; message: string }> => {
  await connectDB();
  if (type === 'forgot-password') {
    const user = await User.findOne({ email }).select('+email +password');
    if (!user) {
      return {
        success: false,
        message: 'Email not found!',
      };
    }
  }

  if (type === 'registration') {
    const user = await User.findOne({ email }).select('+email');
    if (user) {
      return {
        success: false,
        message: 'Email already exists!',
      };
    }
  }

  const otp = generateOtp();
  // TODO: Remove this
  console.log(otp);
  const res = await Otp.findOne({ id: email });

  if (res) {
    if (res.otpCount >= 3) {
      return {
        success: false,
        message: 'Too many OTP requests',
      };
    }
    await Otp.updateOne({ id: email }, { otp, otpCount: res.otpCount + 1 });
  } else {
    await Otp.create({ id: email, otp });
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
  await connectDB();
  const res = await Otp.findOne({ id: email, otp });

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
  await connectDB();
  const user = await User.findOne({ email }).select('+email');
  if (user) {
    return {
      success: false,
      message: 'Email already exists!',
    };
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = await User.create({
    email,
    password: hashedPassword,
    name,
    dob,
    gender,
  });

  if (!newUser) {
    return {
      success: false,
      message: 'Failed to create your account',
    };
  }

  const emailTasks = [
    sendHTMLEmail({
      to: email,
      subject: `Welcome to ${APP_INFO.name}`,
      html: WelcomeUser(newUser),
    }),
  ];
  Promise.all(emailTasks);

  return {
    success: true,
    message: 'Registration successful',
  };
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
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

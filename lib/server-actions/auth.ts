'use server';

import bcrypt from 'bcryptjs';

import { connectDB } from '../db';
import { generateOtp } from '../functions';
import { sendHTMLEmail } from './email';

import { signIn } from '@/auth';
import { APP_INFO } from '@/lib/config';
import Otp from '@/models/Otp';
import User from '@/models/User';
import { OtpEmail, WelcomeUser } from '@/templates/email';

const passwordGenerator = async () => {
  const password =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  const hashedPassword = await bcrypt.hash(password, 12);
  return { password, hashedPassword };
};

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
  type = 'registration',
}: {
  email: string;
  otp: number;
  type?: 'registration' | 'forgot-password';
}) => {
  const res = await Otp.findOne({ id: email, otp });

  if (!res) {
    return {
      success: false,
      message: 'Invalid OTP',
    };
  }
  const { password, hashedPassword } = await passwordGenerator();
  if (type === 'registration') {
    await User.create({
      email,
      password: hashedPassword,
      onboarding: { isEmailVerified: true },
    });

    await signIn('credentials', {
      email,
      password,
    });
    return {
      success: true,
      message: 'Verification successful',
    };
  } else {
    return {
      success: true,
      message: 'Verification successful',
    };
  }
};

export const updatePassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  await connectDB();
  const user = await User.findOne({ email });
  if (!user) {
    return {
      success: false,
      message: 'User not Found',
    };
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  user.password = hashedPassword;
  await user.save();
  return {
    success: true,
    message: 'Password updated successfully',
  };
};

export const register = async ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) => {
  await connectDB();
  const user = await User.findOne({ email }).select('+email');
  if (user) {
    return {
      success: false,
      message: 'Email already exists!',
    };
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = await User.create({ email, password: hashedPassword, name });

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

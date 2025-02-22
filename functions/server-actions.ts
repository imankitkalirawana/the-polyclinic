'use server';
import Service from '@/models/Service';
import User from '@/models/User';
import Doctor from '@/models/Doctor';
import Otp from '@/models/Otp';
import Appointment from '@/models/Appointment';
import { connectDB } from '@/lib/db';
import { transporter } from '@/lib/nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import { generateOtp, sendSMS } from '@/lib/functions';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  AppointmentStatus,
  RescheduledAppointment
} from '@/utils/email-template/patient';
import { sendHTMLEmail } from './server-actions/emails/send-email';

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

export const verifyPhone = async (phone: string, _id?: string) => {
  await connectDB();
  const user = await User.findOne({ phone });
  if (!user) {
    return false;
  }
  if (_id && user._id.toString() === _id) {
    return false;
  }
  return true;
};

export const sendMail = async (mailOptions: MailOptions) => {
  return await transporter.sendMail(mailOptions);
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

export const getAllUsers = async (id: string) => {
  await connectDB();
  const users = await User.find({
    $or: [{ email: id }, { phone: id }],
    status: 'active'
  })
    .select('_id name email phone role status image')
    .lean();

  return users.map((user) => ({
    ...user,
    _id: user._id.toString()
  }));
};

export const getAllPatients = async () => {
  await connectDB();
  const users = await User.find({ role: 'user' }).select('-password').lean();

  return users.map((user) => ({
    ...user,
    _id: user._id.toString()
  }));
};

export const getAllDoctors = async () => {
  await connectDB();
  const doctors = await Doctor.find().select('-password').lean();

  return doctors.map((doctor) => ({
    ...doctor,
    _id: doctor._id.toString()
  }));
};

// server related functions

export const getServiceWithUID = async (uid: string) => {
  await connectDB();
  const service = await Service.findOne({ uniqueId: uid }).lean();

  if (!service) {
    throw new Error('Service not found');
  }
  return {
    ...service,
    _id: service?._id.toString()
  };
};

// user related functions

export const getUserWithUID = async (uid: number) => {
  await connectDB();
  const user = await User.findOne({ uid }).lean();
  if (!user) {
    throw new Error('User not found');
  }
  return {
    ...user,
    _id: user?._id.toString()
  };
};

// doctor related functions

export const getDoctorWithUID = async (uid: number) => {
  await connectDB();
  const doctor = await Doctor.findOne({ uid })
    .select('_id name uid email phone designation')
    .lean();
  if (!doctor) {
    throw new Error('Doctor not found');
  }
  return {
    ...doctor,
    _id: doctor?._id.toString()
  };
};

// appointment related functions

export const changeAppointmentStatus = async (id: string, status: string) => {
  const emailMessageMap: Record<string, string> = {
    confirmed: 'Your Appointment is Confirmed',
    cancelled: 'Your Appointment is Cancelled'
  };

  await connectDB();
  const appointment = await Appointment.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  ).lean();
  if (!appointment) {
    throw new Error('Appointment not found');
  } else {
    const emailTasks = [
      sendHTMLEmail({
        to: appointment.patient.email,
        subject: `Appointment Status: ${emailMessageMap[status]}`,
        html: AppointmentStatus(appointment)
      }).catch((error) => {
        console.error(error);
      })
    ];

    Promise.all(emailTasks).catch((error) => {
      console.error('Error in email sending:', error);
    });

    return true;
  }
};

// drugs

export const redirectTo = (url: string) => {
  revalidatePath(url);
  redirect(url);
};

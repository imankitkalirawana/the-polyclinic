'use server';
import Service from '@/models/Service';
import User from '@/models/User';
import Doctor from '@/models/Doctor';
import Drug from '@/models/Drug';
import Otp from '@/models/Otp';
import Appointment from '@/models/Appointment';
import { connectDB } from '@/lib/db';
import { transporter } from '@/lib/nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import {
  generateOtp,
  sendSMS,
  sendMail as sendEmail,
  sendHTMLMail
} from '@/lib/functions';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  AppointmentStatus,
  RescheduledAppointment
} from '@/utils/email-template/patient';

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
    mailOptions.text = `Your OTP is: ${otp}`;
    return await sendMail(mailOptions);
  } else {
    return await sendSMS(id, `Your OTP is: ${otp}`);
  }
};

export const verifyOTP = async (id: string, otp: string) => {
  await connectDB();
  const res = await Otp.findOne({ id });
  if (!res) {
    throw new Error('OTP Expired');
  }
  if (res.otp !== otp) {
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
    const doctor = await getDoctorWithUID(appointment.doctor);
    const emailTasks = [
      sendHTMLMail(
        appointment.email,
        `Appointment Status: ${emailMessageMap[status]}`,
        AppointmentStatus(appointment, `${doctor.name} (#${doctor.uid})`)
      ).catch((error) => {
        console.error(error);
      })
    ];

    Promise.all(emailTasks).catch((error) => {
      console.error('Error in email sending:', error);
    });

    return true;
  }
};

export const rescheduleAppointment = async (aid: number, date: string) => {
  await connectDB();
  const previousAppointment = await Appointment.findOne({ aid })
    .select('date aid')
    .lean();
  const previousDate = previousAppointment?.date;
  const appointment = await Appointment.findOneAndUpdate(
    { aid },
    { date },
    { new: true }
  );
  if (!appointment) {
    throw new Error('Appointment not found');
  } else {
    const doctor = await getDoctorWithUID(appointment.doctor);

    const emailTasks = [
      sendHTMLMail(
        appointment.email,
        'Appointment Rescheduled',
        RescheduledAppointment(
          appointment,
          previousDate as Date,
          `${doctor.name} (#${doctor.uid})`
        )
      ).catch((error) => {
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

export const getAllDrugs = async () => {
  await connectDB();
  const drugs = await Drug.find()
    .select('brandName genericName frequency did')
    .lean();
  return drugs.map((drug) => ({
    ...drug,
    _id: drug._id.toString()
  }));
};

export const redirectTo = (url: string) => {
  revalidatePath(url);
  redirect(url);
};
export const overdueAppointments = async () => {
  // find appointments that are in past and status is not overdue, cancelled or completed
  await connectDB();
  const appointments = await Appointment.find({
    date: { $lt: new Date().toISOString() },
    status: { $nin: ['overdue', 'cancelled', 'completed'] }
  }).lean();

  for (const appointment of appointments) {
    await Appointment.findOneAndUpdate(
      { aid: appointment.aid },
      { status: 'overdue' },
      { new: true }
    ).then(async () => {
      await sendEmail(
        appointment.email,
        'Appointment Status',
        'Your appointment is overdue'
      );
    });
  }
};

import { checkDomainMx, transporter } from './nodemailer';
const email = process.env.EMAIL || 'contact@divinely.dev';
import Otp from '@/models/Otp';
import { connectDB } from './db';
import { countryProp } from '@/components/dashboard/users/edit/countries';
import axios from 'axios';
import { API_BASE_URL } from './config';

export const sendMail = async (
  to: string,
  subject: string,
  message: string,
  title?: string
) => {
  const mailOptions = {
    from: {
      name: title ? `${title} - The Polyclinic` : 'The Polyclinic',
      address: email
    },
    to: to,
    subject: subject,
    text: message
  };
  return await checkDomainMx(to)
    .then(async () => {
      await transporter
        .sendMail(mailOptions)
        .then(() => {
          console.log('Email sent');
        })
        .catch((err) => {
          console.error('Failed to send email');
          console.error(err);
        });
    })
    .catch((error) => {
      console.error(error);
    });
};

export const sendHTMLMail = async (
  to: string,
  subject: string,
  message: string,
  title?: string
) => {
  const mailOptions = {
    from: {
      name: title ? `${title} - The Polyclinic` : 'The Polyclinic',
      address: email
    },
    to: to,
    subject: subject,
    html: message
  };
  return await checkDomainMx(to)
    .then(async () => {
      await transporter
        .sendMail(mailOptions)
        .then(async () => {
          console.log(`Email sent to ${to}`);
          await axios
            .post(`${API_BASE_URL}api/emails`, {
              from: mailOptions.from.address,
              to: mailOptions.to,
              subject: mailOptions.subject,
              message: mailOptions.html
            })
            .catch((error) => {
              console.error('Failed to save email:', error);
            });
        })
        .catch((err) => {
          console.error('Failed to send email');
          console.error(err);
        });
    })
    .catch((error) => {
      console.error(error);
    });
};

export const sendSMS = async (phone: string, message: string) => {
  console.log(`Your otp for ${phone} is ${message}`);
  return `Your otp for ${phone} is ${message}`;
};

export const generateOtp = () => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp;
};

export const sendOTP = async (id: string) => {
  const otp = generateOtp();
  await connectDB();
  const res = await Otp.findOne({ id });
  if (res) {
    await Otp.updateOne({ id }, { otp, otpCount: res.otpCount + 1 });
  } else {
    await Otp.create({ id, otp });
  }
  if (id.includes('@')) {
    await sendMail(
      id,
      'OTP for Registration',
      `Your OTP is: ${otp}`,
      'Verification'
    );
  } else {
    await sendSMS(id, `Your OTP is: ${otp}`);
  }
  return otp;
};

export const phoneValidate = (phone: string) => {
  if (/^[0-9]{10}$/.test(phone)) {
    return phone;
  } else if (/^91[0-9]{10}$/.test(phone)) {
    return phone.replace(/^91/, '');
  } else if (/^\+91[0-9]{10}$/.test(phone)) {
    return phone.replace(/^\+91/, '');
  } else {
    return null;
  }
};

export const transformCountries = (data: any[]): countryProp[] => {
  return data.map((country) => ({
    name: country.name.common,
    code: country.cca2
  }));
};

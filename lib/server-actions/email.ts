import { MailOptions } from 'nodemailer/lib/json-transport';

import { APP_INFO } from '../config';

import { checkDomainMx, transporter } from '@/lib/nodemailer';

export const defaultMailOptions: MailOptions = {
  from: {
    name: APP_INFO.name,
    address: APP_INFO.email,
  },
  to: '',
  subject: '',
  html: '',
};

export const sendHTMLEmail = async (mailOptions: MailOptions) => {
  const options = { ...defaultMailOptions, ...mailOptions };
  await checkDomainMx(options.to).then(async () => {
    await transporter
      .sendMail(options)
      .then(async () => {
        console.log('Email sent');
      })
      .catch((err) => {
        console.error(err);
        throw new Error(err.message);
      });
  });
};

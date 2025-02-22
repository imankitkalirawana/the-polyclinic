import { CLINIC_INFO } from '@/lib/config';
import { checkDomainMx, transporter } from '@/lib/nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';

export const defaultMailOptions: MailOptions = {
  from: {
    name: CLINIC_INFO.name,
    address: CLINIC_INFO.email
  },
  to: '',
  subject: '',
  html: '<h1>Hello World</h1>'
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

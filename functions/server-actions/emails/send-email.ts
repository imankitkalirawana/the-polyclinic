import { MailOptions } from 'nodemailer/lib/json-transport';

import { CLINIC_INFO, WEBSITE_SETTING } from '@/lib/config';
import { checkDomainMx, transporter } from '@/lib/nodemailer';

export const defaultMailOptions: MailOptions = {
  from: {
    name: CLINIC_INFO.name,
    address: CLINIC_INFO.email,
  },
  to: '',
  subject: '',
  html: '<h1>Hello World</h1>',
};

export const sendHTMLEmail = async (
  mailOptions: MailOptions
): Promise<{ success: boolean; message: string }> => {
  const options = { ...defaultMailOptions, ...mailOptions };
  await checkDomainMx(options.to).then(async () => {
    if (!WEBSITE_SETTING.status.email) {
      return {
        success: false,
        message: 'Email is disabled',
      };
    }
    await transporter
      .sendMail(options)
      .then(async () => ({
        success: true,
        message: 'Email sent successfully',
      }))
      .catch((err) => ({
        success: false,
        message: err.message,
      }));
  });
  return {
    success: false,
    message: 'Internal server error',
  };
};

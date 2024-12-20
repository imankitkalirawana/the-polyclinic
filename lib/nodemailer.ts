import nodemailer from 'nodemailer';
import dns from 'dns';
const email = process.env.EMAIL;
const password = process.env.PASSWORD;

export const transporter = nodemailer.createTransport({
  host: 'smtpout.secureserver.net',
  port: 465,
  secure: true,
  auth: {
    user: email,
    pass: password
  }
});

export function checkDomainMx(email: string) {
  return new Promise((resolve, reject) => {
    const domain = email.split('@')[1];
    dns.resolveMx(domain, (err, addresses) => {
      if (err) {
        reject('Invalid domain');
      } else if (addresses && addresses.length > 0) {
        resolve('Valid domain with MX records');
      } else {
        reject('No MX records found');
      }
    });
  });
}

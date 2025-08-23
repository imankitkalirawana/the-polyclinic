import { MailOptions } from 'nodemailer/lib/json-transport';
import { betterAuth } from 'better-auth';
import { MongoClient } from 'mongodb';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { passkey } from 'better-auth/plugins/passkey';
import { admin as adminPlugin, createAuthMiddleware } from 'better-auth/plugins';
import { organization } from 'better-auth/plugins';
import { emailOTP } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';
import { OtpEmail } from '@/templates/email';
import { APP_INFO } from '@/lib/config';
import { sendHTMLEmail } from '../lib/server-actions/email';

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db();

export const auth = betterAuth({
  appName: APP_INFO.name,
  database: mongodbAdapter(db),
  user: {
    deleteUser: {
      enabled: true,
    },
    additionalFields: {
      uid: {
        type: 'number',
      },
      role: {
        type: 'string',
        default: 'patient',
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url: _url, token }, _request) => {
      const MailOptions: MailOptions = {
        to: user.email,
        subject: `Reset your password - ${APP_INFO.name}`,
        html: OtpEmail(token),
      };
      await sendHTMLEmail(MailOptions);
    },
    onPasswordReset: async ({ user }, _request) => {
      console.log(`Password for user ${user.email} has been reset.`);
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token: _token }, _request) => {
      const MailOptions: MailOptions = {
        to: user.email,
        subject: `Verify your email address - ${APP_INFO.name}`,
        html: OtpEmail(url),
      };
      sendHTMLEmail(MailOptions);
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
  plugins: [
    passkey(),
    adminPlugin({
      defaultRole: 'patient',
      adminRoles: ['admin', 'superadmin'],
    }),
    organization({
      allowUserToCreateOrganization: async (user) => user.role === 'superadmin',
      async sendInvitationEmail(data) {
        const inviteLink = `${process.env.NEXT_PUBLIC_URL}/accept-invitation/${data.id}`;
        sendHTMLEmail({
          to: data.email,
          subject: `Invitation to join ${data.organization.name}`,
          html: OtpEmail(inviteLink),
        });
        // sendOrganizationInvitation({
        //   email: data.email,
        //   invitedByUsername: data.inviter.user.name,
        //   invitedByEmail: data.inviter.user.email,
        //   teamName: data.organization.name,
        //   inviteLink,
        // });
      },
    }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        const MailOptions: MailOptions = {
          to: email,
          subject: `${otp} - ${APP_INFO.name} ${type === 'email-verification' ? 'Verification' : 'Reset Password'}`,
          html: OtpEmail(otp),
        };
        const emailTasks = [sendHTMLEmail(MailOptions)];
        Promise.all(emailTasks);
      },
    }),
    nextCookies(), // make sure this is the last plugin in the array
  ],
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith('/sign-up')) {
        const newSession = ctx.context.newSession;
        if (newSession) {
          const user = await db.collection('user').findOne({ email: newSession.user.email });
          const previousId = await db.collection('counters').findOne({ id: 'uid' });
          const nextId = previousId ? previousId.seq + 1 : 1;
          if (user) {
            await db.collection('user').updateOne({ uid: user.uid }, { $set: { uid: nextId } });
            await db.collection('counters').updateOne({ id: 'uid' }, { $set: { seq: nextId } });
          }
        }
      }
    }),
  },
  telemetry: {
    enabled: false,
  },
});

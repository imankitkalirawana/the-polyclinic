import { APP_INFO } from '@/libs/config';
import { UserType } from '@/services/common/user/user.types';
import { VerificationType } from '@/types';

export function WelcomeUser(user: UserType) {
  return `
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Welcome to ${APP_INFO.name}</title>
            <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
            .flex {
                display: flex;
            }
            .justify-center {
                justify-content: center;
            }
            .icon {
                width: 180px;
                height: 180px;
                margin: 20px auto;
            }
            .heading {
                font-size: 32px;
                line-height: 1.1;
                margin: 40px 0;
                color: #1d1d1f;
                text-align: center;
            }
            .highlight {
                background-color: #fef6d6;
                padding: 0 4px;
            }
            .description {
                font-size: 16px;
                line-height: 1.4;
                color: #1d1d1f;
                margin: 20px auto;
                max-width: 750px;
                margin-bottom: 40px;
                text-align: center;
            }
            .link {
                text-decoration: none;
                color: #1255CC;
            }
            .link:hover {
                text-decoration: underline;
            }
            .learn-more:hover {
                text-decoration: underline;
            }
            .overview {
                font-size: 12px;
                color: #1d1d1f;
                margin-top: 40px;
                text-align: center;
            }
            </style>
        </head>
        <body>
            <div class="flex justify-center">
                <img
                class="icon"
                src="${APP_INFO.url}logo.png"
                alt="App Logo"
                />
            </div>

            <h1 class="heading">Welcome to ${APP_INFO.name}, ${user.name}!</h1>

            <p class="description">
            Your account has been created for ${APP_INFO.name}, you can now explore the platform.
            </p>
            <p class="description">
            We are excited to have you onboard. If you have any questions or need
            assistance, please feel free to reach out to us.
            </p>
            <p class="description">
            Please use your email <strong>${user.email}</strong> to <a class="link href="${APP_INFO.url}auth/login">login</a>.
            </p>
            <p class="overview">
            You are getting this email because you have registered with ${APP_INFO.name}
            </p>
        </body>
    </html>
`;
}

export function OtpEmail({
  otp,
  type = 'register',
}: {
  otp: number | string;
  type: VerificationType;
}) {
  const TYPE_MAP: Record<
    VerificationType,
    {
      title: string;
      description: string;
      code: number | string;
    }
  > = {
    register: {
      title: `Verify your email to sign up for ${APP_INFO.name}!`,
      description: `We have received a sign-up attempt from ${APP_INFO.name}`,
      code: otp,
    },
    'reset-password': {
      title: `Reset your password for ${APP_INFO.name}!`,
      description: `We have received a password reset attempt from ${APP_INFO.name}`,
      code: otp,
    },
    'verify-email': {
      title: `Verify your email for ${APP_INFO.name}!`,
      description: `We have received a verification attempt from ${APP_INFO.name}`,
      code: otp,
    },
  } as const;
  return `<html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Welcome to ${APP_INFO.name}</title>
            <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
            .flex {
                display: flex;
            }
            .justify-center {
                justify-content: center;
            }
            .icon {
                width: 180px;
                height: 180px;
                margin: 20px auto;
                object-fit: contain;
            }
            .heading {
                font-size: 32px;
                line-height: 1.1;
                margin: 40px 0;
                color: #1d1d1f;
                text-align: center;
            }
            .highlight {
                background-color: #fef6d6;
                padding: 0 4px;
            }
            .description {
                font-size: 16px;
                line-height: 1.4;
                color: #1d1d1f;
                margin: 20px auto;
                max-width: 750px;
                margin-bottom: 40px;
                text-align: center;
            }
            .code {
              padding: 8px 12px;
              background: #F6F6F6;
              width: 90%;
              margin: 0 auto;
              border-radius: 5px;
              font-weight: 700;
              text-align: center;
            }
            .btn {
                text-decoration: none;
                font-size: 16px;
                margin-top: 20px;
                display: inline-block;
                border-radius: 50px;
                padding: 8px 16px;
            }
            .btn-primary {
                background-color: #1f6439;
                color: #fff;
            }
            .learn-more:hover {
                text-decoration: underline;
            }
            .overview {
                font-size: 12px;
                color: #1d1d1f;
                margin-top: 40px;
                text-align: center;
            }
            </style>
        </head>
        <body>
            <div class="flex justify-center">
                <img
                class="icon"
                src="${APP_INFO.url}logo.png"
                alt="App Logo"
                />
            </div>

            <h1 class="heading">${TYPE_MAP[type].title}</h1>

            <p class="description">
            ${TYPE_MAP[type].description}
            </p>
            <p class="description">
            To complete the ${type} process; enter the 4-digit code in the original window:
            </p>
            <p class="code">
            ${TYPE_MAP[type].code}
            </p>
            <p class="overview">
            Please ignore if you haven't requested this code.
            </p>
        </body>
    </html>`;
}

export function AppointmentNotificationEmail({
  doctorName,
  patientName,
  appointmentDate,
  appointmentTime,
  appointmentId,
  symptoms,
  notes,
}: {
  doctorName: string;
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentId: string;
  symptoms?: string;
  notes?: string;
}) {
  return `<html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>New Appointment Request - ${APP_INFO.name}</title>
            <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
            .flex {
                display: flex;
            }
            .justify-center {
                justify-content: center;
            }
            .icon {
                width: 120px;
                height: 120px;
                margin: 20px auto;
                object-fit: contain;
            }
            .heading {
                font-size: 28px;
                line-height: 1.1;
                margin: 30px 0;
                color: #1d1d1f;
                text-align: center;
            }
            .description {
                font-size: 16px;
                line-height: 1.4;
                color: #1d1d1f;
                margin: 20px auto;
                max-width: 750px;
                margin-bottom: 30px;
                text-align: left;
            }
            .appointment-details {
                background-color: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
                text-align: left;
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                margin: 10px 0;
                padding: 8px 0;
                border-bottom: 1px solid #e9ecef;
            }
            .detail-row:last-child {
                border-bottom: none;
            }
            .detail-label {
                font-weight: 600;
                color: #495057;
            }
            .detail-value {
                color: #1d1d1f;
            }
            .btn {
                text-decoration: none;
                font-size: 16px;
                margin: 20px 10px;
                display: inline-block;
                border-radius: 8px;
                padding: 12px 24px;
                font-weight: 600;
            }
            .btn-primary {
                background-color: #1f6439;
                color: #fff;
            }
            .btn-secondary {
                background-color: #6c757d;
                color: #fff;
            }
            .overview {
                font-size: 12px;
                color: #6c757d;
                margin-top: 40px;
                text-align: center;
            }
            .symptoms, .notes {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 6px;
                padding: 15px;
                margin: 15px 0;
                text-align: left;
            }
            .symptoms h4, .notes h4 {
                margin: 0 0 10px 0;
                color: #856404;
                font-size: 14px;
                font-weight: 600;
            }
            </style>
        </head>
        <body>
            <div class="flex justify-center">
                <img
                class="icon"
                src="${APP_INFO.url}logo.png"
                alt="App Logo"
                />
            </div>

            <h1 class="heading">New Appointment Request</h1>

            <p class="description">
                Dear Dr. ${doctorName},
            </p>
            
            <p class="description">
                You have received a new appointment request from a patient. Please review the details below and take appropriate action.
            </p>

            <div class="appointment-details">
                <div class="detail-row">
                    <span class="detail-label">Patient Name:</span>
                    <span class="detail-value">${patientName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Appointment Date:</span>
                    <span class="detail-value">${appointmentDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Appointment Time:</span>
                    <span class="detail-value">${appointmentTime}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Appointment ID:</span>
                    <span class="detail-value">${appointmentId}</span>
                </div>
            </div>

            ${
              symptoms
                ? `
            <div class="symptoms">
                <h4>Patient Symptoms:</h4>
                <p>${symptoms}</p>
            </div>
            `
                : ''
            }

            ${
              notes
                ? `
            <div class="notes">
                <h4>Additional Notes:</h4>
                <p>${notes}</p>
            </div>
            `
                : ''
            }

            <p class="description">
                Please log in to your dashboard to accept or decline this appointment request.
            </p>

            <div style="text-align: center; margin: 30px 0;">
                <a href="${APP_INFO.url}dashboard/appointments" class="btn btn-primary">
                    View Dashboard
                </a>
            </div>

            <p class="overview">
                This is an automated notification from ${APP_INFO.name}. Please do not reply to this email.
            </p>
        </body>
    </html>`;
}

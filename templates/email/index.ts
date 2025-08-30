import { APP_INFO } from '@/lib/config';
import { UnifiedUser } from '@/services/common/user';
import { VerificationType } from '@/types';

export function WelcomeUser(user: UnifiedUser) {
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

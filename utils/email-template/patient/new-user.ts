import { CLINIC_INFO } from '@/lib/config';
import { UserType } from '@/models/User';

export function WelcomeUser(user: UserType) {
  return `
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Welcome to ${CLINIC_INFO.name}</title>
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
            }
            </style>
        </head>
        <body>
            <div class="flex justify-center">
                <img
                class="icon"
                src="${CLINIC_INFO.url}logo.png"
                alt="Clinic Logo"
                />
            </div>

            <h1 class="heading">Welcome to ${CLINIC_INFO.name}, ${user.name}!</h1>

            <p class="description">
            Your account has been created for ${CLINIC_INFO.name}, you can now track your
            appointments, view your medical records, and more.
            </p>
            <p class="description">
            We are excited to have you on board. If you have any questions or need
            assistance, please feel free to reach out to us.
            </p>
            <p class="description">
            Please use your email <strong>${user.email}</strong> to login.
            </p>
        

            <div class="flex justify-center">
                <a href="${CLINIC_INFO.url}auth/login" class="btn btn-primary">Login</a>
            </div>

            <p class="overview">
            You are getting this email because you have registered with ${CLINIC_INFO.name}
            </p>
        </body>
    </html>
`;
}

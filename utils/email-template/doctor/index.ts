import { format } from 'date-fns';

import { API_BASE_URL } from '@/libs/config';
import { AppointmentType } from '@/services/client/appointment';

export function NewAppointment(appointment: AppointmentType) {
  return `<body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; background-color: #ffffff; color: #1a1a1a; line-height: 1.5;">
    <div style="max-width: 800px; margin: 0 auto; text-align: center;">
        <h1 style="color: #73CD7D; font-size: 32px; margin-bottom: 40px; font-weight: 700;">New Patient Appointment</h1>
        
        <div style="background-color: #73CD7D10; border-radius: 12px; padding: 24px; margin-bottom: 32px; text-align: left;">
            <h2 style="color: #1d1b48; font-size: 24px; margin-top: 0; margin-bottom: 24px;">Patient Information</h2>
            
            <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                <div style="flex: 1; min-width: 200px;">
                    <p style="font-size: 16px; color: #6b7280; margin: 0 0 4px;">Name</p>
                    <p style="font-size: 18px; color: #1d1b48; font-weight: 500; margin: 0;">${appointment.patient.name}</p>
                </div>
                <div style="flex: 1; min-width: 200px;">
                    <p style="font-size: 16px; color: #6b7280; margin: 0 0 4px;">Phone</p>
                    <p style="font-size: 18px; color: #1d1b48; font-weight: 500; margin: 0;">${appointment.patient?.phone || '-'}</p>
                </div>
                <div style="flex: 1; min-width: 200px;">
                    <p style="font-size: 16px; color: #6b7280; margin: 0 0 4px;">Email</p>
                    <p style="font-size: 18px; color: #1d1b48; font-weight: 500; margin: 0;">${appointment.patient.email}</p>
                </div>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
            
            <h2 style="color: #1d1b48; font-size: 24px; margin-top: 0; margin-bottom: 24px;">Appointment Details</h2>
            
            <div style="display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 24px;">
                <div style="flex: 1; min-width: 200px;">
                    <p style="font-size: 16px; color: #6b7280; margin: 0 0 4px;">Date</p>
                    <p style="font-size: 18px; color: #73CD7D; font-weight: 500; margin: 0;">${format(appointment?.date, 'PP')}</p>
                </div>
                <div style="flex: 1; min-width: 200px;">
                    <p style="font-size: 16px; color: #6b7280; margin: 0 0 4px;">Time</p>
                    <p style="font-size: 18px; color: #73CD7D; font-weight: 500; margin: 0;">${format(appointment?.date, 'p')}</p>
                </div>
                <div style="flex: 1; min-width: 200px;">
                    <p style="font-size: 16px; color: #6b7280; margin: 0 0 4px;">Duration</p>
                    <p style="font-size: 18px; color: #1d1b48; font-weight: 500; margin: 0;">15 minutes</p>
                </div>
            </div>
            ${
              appointment.additionalInfo.notes &&
              `
            <div style="background-color: #f3f4f6; border-radius: 8px; padding: 16px;">
                <p style="font-size: 16px; color: #6b7280; margin: 0 0 8px;">Appointment Notes</p>
                <p style="font-size: 16px; color: #1d1b48; margin: 0; line-height: 1.6;">
                    ${appointment.additionalInfo.notes}
                </p>
            </div>
            `
            }
        </div>
        
        <div style="display: flex; justify-content: center; gap: 16px;">
            <a href="${API_BASE_URL}appointments?aid=${appointment.aid}&status=all&query=${appointment.aid}" style="display: inline-block; background-color: #73CD7D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: 500; transition: background-color 0.3s ease;">
                Confirm Appointment
            </a>
            <a href="${API_BASE_URL}appointments?aid=${appointment.aid}&status=all&query=${appointment.aid}" style="display: inline-block; background-color: #ffffff; color: #F31260; border: 1px solid #F31260; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: 500; transition: background-color 0.3s ease; margin-left: 8px;">
                Reschedule
            </a>
        </div>
        
        <p style="font-size: 16px; color: #6b7280; margin-top: 32px;">
            For any questions or concerns, please contact the scheduling department at contact@divinely.dev
        </p>
    </div>
</body>`;
}

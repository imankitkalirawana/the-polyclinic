import { format } from 'date-fns';

import { API_BASE_URL, CLINIC_INFO } from '@/libs/config';
import { AppointmentType } from '@/services/client/appointment';

export function AppointmentStatus(appointment: AppointmentType) {
  const statusDescriptionMap: Record<string, string> = {
    booked:
      "We've received your appointment request. Your appointment is currently booked and awaiting confirmation. Stay tuned for updates!",
    confirmed:
      "Great news! Your appointment has been confirmed. We're looking forward to seeing you. Feel free to reach out if you have any questions.",
    cancelled:
      "Your appointment has been cancelled. If this was a mistake or you'd like to rebook, simply use the button below.",
    overdue:
      'We noticed you missed your scheduled appointment. No worries - you can easily reschedule using the button below.',
    completed:
      'Thank you for visiting us! Your appointment has been successfully completed. If you have feedback or need further assistance, let us know.',
    'on-hold':
      "Your appointment is currently on hold. We'll notify you once it's ready to move forward. If you have any questions, feel free to contact us.",
  };

  const statusColorMap: Record<string, string> = {
    booked: '#73CD7D',
    confirmed: '#73CD7D',
    cancelled: '#F31260',
    overdue: '#F31260',
    completed: '#10793C',
    'on-hold': '#936316',
  };

  const statusButtonMap: Record<string, string> = {
    booked: 'Track Now',
    confirmed: 'Track Now',
    cancelled: 'View Details',
    overdue: 'Reschedule Now',
    completed: 'View Details',
    'on-hold': 'Track Now',
  };

  return `<body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; background-color: #ffffff; color: #1a1a1a; line-height: 1.5;">
      <div style="max-width: 800px; margin: 0 auto; text-align: center;">
          <h1 style="color: ${statusColorMap[appointment.status]}; font-size: 42px; margin-bottom: 40px; font-weight: 700;">Your Appointment is <span style="text-transform: capitalize;">${appointment.status}</span></h1>
          
          <div style="background-color: ${`${statusColorMap[appointment.status]}10`}; border-radius: 12px; padding: 16px; margin-bottom: 32px; text-align: left;">
              <p style="font-size: 18px; color: #333; margin-bottom: 16px; line-height: 1.6;">
                  <strong style="color: #1d1b48; display: inline-block; width: 180px;">Appointment ID:</strong> 
                  #${appointment.aid}
              </p>
              
              <p style="font-size: 18px; color: #333; margin-bottom: 16px; line-height: 1.6;">
                  <strong style="color: #1d1b48; display: inline-block; width: 180px;">Patient Name:</strong> 
                  ${appointment.patient.name}
              </p>
              <p style="font-size: 18px; color: #333; margin-bottom: 16px; line-height: 1.6;">
                  <strong style="color: #1d1b48; display: inline-block; width: 180px;">Doctor:</strong> 
                  ${appointment.doctor?.name || 'Not Assigned'}
              </p>
              
              <p style="font-size: 18px; color: #333; margin-bottom: 16px; line-height: 1.6;">
                  <strong style="color: #1d1b48; display: inline-block; width: 180px;">Appointment Date:</strong> 
                  ${format(appointment.date, 'PPp')}
              </p>
              
              <p style="font-size: 18px; color: #333; margin-bottom: 16px; line-height: 1.6;">
                  <strong style="color: #1d1b48; display: inline-block; width: 180px;">Status:</strong> 
                  <span style="color: ${statusColorMap[appointment.status]}; font-weight: 500; text-transform: capitalize;">${appointment.status}</span>
              </p>
          </div>
          
          <p style="font-size: 20px; color: #4b5563; margin-bottom: 32px; line-height: 1.4;">
              ${statusDescriptionMap[appointment.status]}
          </p>
          
          <a href="${API_BASE_URL}appointments?aid=${appointment.aid}&status=all&query=${appointment.aid}" style="display: inline-block; background-color: ${statusColorMap[appointment.status]}; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-size: 20px; font-weight: 500; transition: background-color 0.3s ease;">
              ${statusButtonMap[appointment.status]}
          </a>
          
          <p style="font-size: 16px; color: #6b7280; margin-top: 32px;">
              If you need assistance, please contact our support team at ${CLINIC_INFO.email}
          </p>
      </div>
  </body>`;
}

export function RescheduledAppointment(appointment: AppointmentType, previousDate: Date | string) {
  return `<body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; background-color: #ffffff; color: #1a1a1a; line-height: 1.5;">
    <div style="max-width: 800px; margin: 0 auto; text-align: center;">
        <h1 style="color: #73CD7D; font-size: 32px; margin-bottom: 40px; font-weight: 700;">Your Appointment Has Been Rescheduled</h1>
        
        <div style="background-color: #73CD7D10; border-radius: 12px; padding: 16px; margin-bottom: 32px; text-align: left;">
            <p style="font-size: 18px; color: #333; margin-bottom: 16px; line-height: 1.6;">
                <strong style="color: #1d1b48; display: inline-block; width: 180px;">Appointment ID:</strong> 
                #${appointment.aid}
            </p>
            
            <p style="font-size: 18px; color: #333; margin-bottom: 16px; line-height: 1.6;">
                <strong style="color: #1d1b48; display: inline-block; width: 180px;">Patient Name:</strong> 
                ${appointment.patient?.name}
            </p>
            <p style="font-size: 18px; color: #333; margin-bottom: 16px; line-height: 1.6;">
                <strong style="color: #1d1b48; display: inline-block; width: 180px;">Doctor:</strong> 
                ${appointment.doctor?.name || 'Not Assigned'}
            </p>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; background-color: #f3f4f6; border-radius: 8px; padding: 16px;">
                <div style="text-align: center;">
                    <p style="font-size: 16px; color: #6b7280; margin: 0;">Previous Date</p>
                    <p style="font-size: 18px; color: #F31260; margin: 8px 0 0; font-weight: 500;">${format(previousDate, 'PP')}</p>
                    <p style="font-size: 16px; color: #F31260; margin: 4px 0 0;">${format(new Date(previousDate), 'p')}</p>
                </div>
                <div style="font-size: 24px; color: #73CD7D;">→</div>
                <div style="text-align: center;">
                    <p style="font-size: 16px; color: #6b7280; margin: 0;">New Date</p>
                    <p style="font-size: 18px; color: #73CD7D; margin: 8px 0 0; font-weight: 500;">${format(appointment.date, 'PP')}</p>
                    <p style="font-size: 16px; color: #73CD7D; margin: 4px 0 0;">${format(new Date(appointment.date), 'p')}</p>
                </div>
            </div>
            
            <p style="font-size: 18px; color: #333; margin-bottom: 16px; line-height: 1.6;">
                <strong style="color: #1d1b48; display: inline-block; width: 180px;">Status:</strong> 
                <span style="color: #73CD7D; font-weight: 500; text-transform: capitalize;">${appointment.status}</span>
            </p>
        </div>
        
        <p style="font-size: 20px; color: #4b5563; margin-bottom: 32px; line-height: 1.4;">
            Your appointment has been successfully rescheduled. If you need to make any changes, please use the button below.
        </p>
        
        <a href="${API_BASE_URL}appointments?aid=${appointment.aid}&status=all&query=${appointment.aid}" style="display: inline-block; background-color: #73CD7D; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-size: 20px; font-weight: 500; transition: background-color 0.3s ease;">
            Manage Appointment
        </a>
        
        <p style="font-size: 16px; color: #6b7280; margin-top: 32px;">
            If you need assistance, please contact our support team at contact@divinely.dev
        </p>
    </div>
</body>`;
}

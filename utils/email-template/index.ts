import { API_BASE_URL } from '@/lib/config';

export function OverdueEmail(aid: number, name: string, date: string) {
  return `<body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; background-color: #ffffff; color: #1a1a1a; line-height: 1.5;">
    <div style="max-width: 800px; margin: 0 auto; text-align: center;">
        <h1 style="color: #F31260; font-size: 42px; margin-bottom: 40px; font-weight: 700;">Your Appointment is Overdue</h1>
        <div style="background-color: #F3126010; border-radius: 12px; padding: 16px; margin-bottom: 32px; text-align: left;">
            <p style="font-size: 18px; color: #333; margin-bottom: 16px; line-height: 1.6;">
                <strong style="color: #1d1b48; display: inline-block; width: 180px;">Appointment ID:</strong> 
                #${aid}
            </p>
            
            <p style="font-size: 18px; color: #333; margin-bottom: 16px; line-height: 1.6;">
                <strong style="color: #1d1b48; display: inline-block; width: 180px;">Patient Name:</strong> 
                ${name}
            </p>
            
            <p style="font-size: 18px; color: #333; margin-bottom: 16px; line-height: 1.6;">
                <strong style="color: #1d1b48; display: inline-block; width: 180px;">Appointment Date:</strong> 
                ${date}
            </p>
            
            <p style="font-size: 18px; color: #333; margin-bottom: 16px; line-height: 1.6;">
                <strong style="color: #1d1b48; display: inline-block; width: 180px;">Status:</strong> 
                <span style="color: #F31260; font-weight: 500;">Missed</span>
            </p>
        </div>
        
        <p style="font-size: 20px; color: #4b5563; margin-bottom: 32px; line-height: 1.4;">
            We noticed you missed your scheduled appointment. No worries - you can easily reschedule using the button below.
        </p>
        
        <a href="${API_BASE_URL}appointments?aid=${aid}&status=overdue" style="display: inline-block; background-color: #F31260; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-size: 20px; font-weight: 500; transition: background-color 0.3s ease;">
            Reschedule Now 
        </a>
        
        <p style="font-size: 16px; color: #6b7280; margin-top: 32px;">
            If you need assistance, please contact our support team at contact@divinely.dev
        </p>
    </div>
</body>`;
}

export function AppointmentStatus(
  aid: number,
  name: string,
  date: string,
  status:
    | 'booked'
    | 'confirmed'
    | 'cancelled'
    | 'overdue'
    | 'completed'
    | 'on-hold',
  doctor: string
) {
  const statusDescriptionMap: Record<string, string> = {
    booked:
      "We've received your appointment request. Your appointment is currently booked and awaiting confirmation. Stay tuned for updates!",
    confirmed:
      "Great news! Your appointment has been confirmed. We're looking forward to seeing you. Feel free to reach out if you have any questions.",
    cancelled:
      "Your appointment has been cancelled as per your request. If this was a mistake or you'd like to rebook, simply use the button below.",
    overdue:
      'We noticed you missed your scheduled appointment. No worries - you can easily reschedule using the button below.',
    completed:
      'Thank you for visiting us! Your appointment has been successfully completed. If you have feedback or need further assistance, let us know.',
    'on-hold':
      "Your appointment is currently on hold. We'll notify you once it's ready to move forward. If you have any questions, feel free to contact us."
  };

  const statusColorMap: Record<string, string> = {
    booked: '#73CD7D',
    confirmed: '#73CD7D',
    cancelled: '#F31260',
    overdue: '#F31260',
    completed: '#10793C',
    'on-hold': '#936316'
  };

  const statusButtonMap: Record<string, string> = {
    booked: 'Track Now',
    confirmed: 'Track Now',
    cancelled: 'View Details',
    overdue: 'Reschedule Now',
    completed: 'View Details',
    'on-hold': 'Track Now'
  };

  return `<body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; background-color: #ffffff; color: #1a1a1a; line-height: 1.5;">
    <div style="max-width: 800px; margin: 0 auto; text-align: center;">
        <h1 style="color: ${statusColorMap[status]}; font-size: 42px; margin-bottom: 40px; font-weight: 700;">Your Appointment is <span style="text-transform: capitalize;">${status}</span></h1>
        
        <div style="background-color: ${statusColorMap[status] + '10'}; border-radius: 12px; padding: 16px; margin-bottom: 32px; text-align: left;">
            <p style="font-size: 18px; color: #333; margin-bottom: 16px; line-height: 1.6;">
                <strong style="color: #1d1b48; display: inline-block; width: 180px;">Appointment ID:</strong> 
                #${aid}
            </p>
            
            <p style="font-size: 18px; color: #333; margin-bottom: 16px; line-height: 1.6;">
                <strong style="color: #1d1b48; display: inline-block; width: 180px;">Patient Name:</strong> 
                ${name}
            </p>
            <p style="font-size: 18px; color: #333; margin-bottom: 16px; line-height: 1.6;">
                <strong style="color: #1d1b48; display: inline-block; width: 180px;">Doctor:</strong> 
                ${doctor}
            </p>
            
            <p style="font-size: 18px; color: #333; margin-bottom: 16px; line-height: 1.6;">
                <strong style="color: #1d1b48; display: inline-block; width: 180px;">Appointment Date:</strong> 
                ${date}
            </p>
            
            <p style="font-size: 18px; color: #333; margin-bottom: 16px; line-height: 1.6;">
                <strong style="color: #1d1b48; display: inline-block; width: 180px;">Status:</strong> 
                <span style="color: ${statusColorMap[status]}; font-weight: 500; text-transform: capitalize;">${status}</span>
            </p>
        </div>
        
        <p style="font-size: 20px; color: #4b5563; margin-bottom: 32px; line-height: 1.4;">
            ${statusDescriptionMap[status]}
        </p>
        
        <a href="${API_BASE_URL}appointments?aid=${aid}&status=all" style="display: inline-block; background-color: ${statusColorMap[status]}; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-size: 20px; font-weight: 500; transition: background-color 0.3s ease;">
            ${statusButtonMap[status]}
        </a>
        
        <p style="font-size: 16px; color: #6b7280; margin-top: 32px;">
            If you need assistance, please contact our support team at contact@divinely.dev
        </p>
    </div>
</body>`;
}

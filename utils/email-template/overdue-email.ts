import { API_BASE_URL } from '@/lib/config';

export function OverdueEmail(aid: number, name: string, date: string) {
  return `<body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; background-color: #ffffff; color: #1a1a1a; line-height: 1.5;">
    <div style="max-width: 800px; margin: 0 auto; text-align: center;">
        <h1 style="color: #73CD7D; font-size: 42px; margin-bottom: 40px; font-weight: 700;">Your Appointment is Overdue</h1>
        
        <div style="background-color: #73CD7D10; border-radius: 12px; padding: 16px; margin-bottom: 32px; text-align: left;">
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
        
        <a href="${API_BASE_URL}appointments?aid=${aid}" style="display: inline-block; background-color: #73CD7D; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-size: 20px; font-weight: 500; transition: background-color 0.3s ease;">
            Reschedule Now 
        </a>
        
        <p style="font-size: 16px; color: #6b7280; margin-top: 32px;">
            If you need assistance, please contact our support team at contact@divinely.dev
        </p>
    </div>
</body>`;
}

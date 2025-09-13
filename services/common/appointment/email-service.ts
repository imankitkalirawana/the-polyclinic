import { sendHTMLEmail } from '@/lib/server-actions/email';
import { AppointmentNotificationEmail } from '@/templates/email';
import { format } from 'date-fns';
import { APP_INFO } from '@/lib/config';

export class AppointmentEmailService {
  /**
   * Send appointment notification email to doctor
   */
  static async sendAppointmentNotificationToDoctor({
    doctorEmail,
    doctorName,
    patientName,
    appointmentDate,
    appointmentId,
    symptoms,
    notes,
  }: {
    doctorEmail: string;
    doctorName: string;
    patientName: string;
    appointmentDate: Date;
    appointmentId: string;
    symptoms?: string;
    notes?: string;
  }): Promise<{ success: boolean; message?: string }> {
    try {
      const subject = `New Appointment Request - ${APP_INFO.name}`;

      const formattedDate = format(appointmentDate, 'EEEE, MMMM d, yyyy');
      const formattedTime = format(appointmentDate, 'h:mm a');

      sendHTMLEmail({
        to: doctorEmail,
        subject,
        html: AppointmentNotificationEmail({
          doctorName,
          patientName,
          appointmentDate: formattedDate,
          appointmentTime: formattedTime,
          appointmentId,
          symptoms,
          notes,
        }),
      });

      return { success: true };
    } catch (error) {
      console.error('Error sending appointment notification email:', error);
      return {
        success: false,
        message: 'Failed to send appointment notification email',
      };
    }
  }
}

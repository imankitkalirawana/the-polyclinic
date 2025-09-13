import { ServiceResult } from '@/services';
import { Connection } from 'mongoose';
import { getAppointmentsWithDetails } from './operations';
import { getAppointmentModel } from './model';
import { format } from 'date-fns';
import { OrganizationUser, UnifiedUser } from '@/services/common/user';
import { AppointmentEmailService } from '@/services/common/appointment/email-service';
import { DoctorService } from '@/services/client/doctor/service';
import { UserService } from '@/services/common/user/service';
import { DoctorType } from '@/services/client/doctor/types';

export class AppointmentService {
  static async getAll(conn: Connection, query: Record<string, unknown>): Promise<ServiceResult> {
    try {
      const appointments = await getAppointmentsWithDetails({
        conn,
        query,
        isStage: true,
      });
      return { success: true, data: appointments };
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Internal Server Error',
      };
    }
  }

  static async create(
    conn: Connection,
    data: Record<string, unknown>,
    role: OrganizationUser['role']
  ): Promise<ServiceResult> {
    try {
      const Appointment = getAppointmentModel(conn);
      if (data.doctorId && (role === 'receptionist' || role === 'admin')) {
        data.status = 'confirmed';
      }

      const appointment = new Appointment(data);
      await appointment.save();

      // Send email notification to doctor if appointment is booked by a patient
      if (role === 'patient' && data.doctorId && data.patientId) {
        try {
          // Get doctor details
          const doctorResult = await DoctorService.getByUID({
            conn,
            uid: data.doctorId as string,
          });

          // Get patient details
          const patientResult = await UserService.getUserByUid({
            conn,
            uid: data.patientId as string,
          });

          if (
            doctorResult.success &&
            patientResult.success &&
            doctorResult.data &&
            patientResult.data
          ) {
            const doctor = doctorResult.data as DoctorType;
            const patient = patientResult.data as UnifiedUser;

            AppointmentEmailService.sendAppointmentNotificationToDoctor({
              doctorEmail: doctor.email,
              doctorName: doctor.name,
              patientName: patient.name,
              appointmentDate: appointment.date,
              appointmentId: appointment.aid,
              symptoms: (data.additionalInfo as { symptoms?: string })?.symptoms,
              notes: (data.additionalInfo as { notes?: string })?.notes,
            });
          }
        } catch (emailError) {
          console.error('Failed to send appointment notification email:', emailError);
        }
      }

      return {
        success: true,
        message: `Appointment scheduled for ${format(appointment.date, 'MMMM do, yyyy')}`,
        data: appointment,
      };
    } catch (error) {
      console.error('Error creating appointment:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Internal Server Error',
      };
    }
  }
}

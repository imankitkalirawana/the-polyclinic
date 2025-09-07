import { ServiceResult } from '@/services';
import { Connection } from 'mongoose';
import { getAppointmentsWithDetails } from './operations';
import { getAppointmentModel } from './model';
import { format } from 'date-fns';

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

  static async create(conn: Connection, data: Record<string, unknown>): Promise<ServiceResult> {
    try {
      const Appointment = getAppointmentModel(conn);
      const appointment = new Appointment(data);
      await appointment.save();
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

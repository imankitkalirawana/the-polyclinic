import { Connection } from 'mongoose';
import { getPatientModel } from '@/services/client/patient/model';
import { ServiceResult } from '@/services';
import { PatientType } from './types';

export class PatientService {
  static async getAll({
    conn,
    phone,
    isPatient = false,
  }: {
    conn: Connection;
    phone: string;
    isPatient: boolean;
  }): Promise<ServiceResult<PatientType[]>> {
    try {
      const Patient = getPatientModel(conn);

      const patients = await Patient.aggregate([
        {
          $match: isPatient ? { phone } : {},
        },
        {
          $lookup: {
            from: 'user',
            localField: 'uid',
            foreignField: 'uid',
            as: 'user',
          },
        },
        {
          $unwind: { path: '$user', preserveNullAndEmptyArrays: false },
        },
        {
          $project: {
            uid: 1,
            name: '$user.name',
            email: '$user.email',
            phone: '$user.phone',
            address: 1,
            age: 1,
            gender: 1,
            createdAt: '$user.createdAt',
            createdBy: '$user.createdBy',
            updatedAt: '$user.updatedAt',
            updatedBy: '$user.updatedBy',
          },
        },
      ]);

      return {
        success: true,
        data: patients,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch patients',
      };
    }
  }

  static async getByUID({
    conn,
    uid,
  }: {
    conn: Connection;
    uid: string;
  }): Promise<ServiceResult<PatientType | null>> {
    try {
      const Patient = getPatientModel(conn);
      const patient = await Patient.aggregate([
        {
          $match: { uid },
        },
        {
          $lookup: {
            from: 'user',
            localField: 'uid',
            foreignField: 'uid',
            as: 'user',
          },
        },
        {
          $unwind: { path: '$user', preserveNullAndEmptyArrays: false },
        },
        {
          $project: {
            uid: 1,
            name: '$user.name',
            email: '$user.email',
            phone: '$user.phone',
            address: 1,
            age: 1,
            gender: 1,
            createdAt: '$user.createdAt',
            createdBy: '$user.createdBy',
            updatedAt: '$user.updatedAt',
            updatedBy: '$user.updatedBy',
          },
        },
      ]);

      return {
        success: true,
        data: patient[0],
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch patient',
      };
    }
  }
}

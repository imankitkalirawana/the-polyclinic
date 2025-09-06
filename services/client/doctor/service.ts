import { ServiceResult } from '@/services';
import { Connection } from 'mongoose';
import { getDoctorModel } from './model';
import { DoctorType } from './types';

export class DoctorService {
  static async getAll({ conn }: { conn: Connection }): Promise<ServiceResult<DoctorType[]>> {
    try {
      const Doctor = getDoctorModel(conn);
      const doctors = await Doctor.aggregate([
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
            image: '$user.image',
            specialization: 1,
            designation: 1,
            seating: 1,
            createdAt: '$user.createdAt',
            createdBy: '$user.createdBy',
            updatedAt: '$user.updatedAt',
            updatedBy: '$user.updatedBy',
          },
        },
      ]);
      return { success: true, data: doctors };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch doctors',
      };
    }
  }

  static async getByUID({
    conn,
    uid,
  }: {
    conn: Connection;
    uid: string;
  }): Promise<ServiceResult<DoctorType | null>> {
    try {
      const Doctor = getDoctorModel(conn);
      const doctor = await Doctor.aggregate([
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
            image: '$user.image',
            specialization: 1,
            designation: 1,
            department: 1,
            experience: 1,
            education: 1,
            biography: 1,
            seating: 1,
            createdAt: '$user.createdAt',
            createdBy: '$user.createdBy',
            updatedAt: '$user.updatedAt',
            updatedBy: '$user.updatedBy',
          },
        },
      ]);
      return { success: true, data: doctor[0] || null };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch doctor',
      };
    }
  }
}

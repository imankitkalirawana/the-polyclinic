import { $FixMe } from '@/types';
import { ServiceResult } from '@/services';
import { Connection } from 'mongoose';
import { getUserModel } from '@/services/common/user/model';
import { UnifiedUser, CreateUser } from './types';
import bcrypt from 'bcryptjs';
import { SERVER_ERROR_MESSAGE } from '@/lib/constants';
import { getPatientModel } from '@/services/client/patient/model';
import { getDoctorModel } from '@/services/client/doctor/model';

export class UserService {
  static async getUserByUid({
    conn,
    uid,
  }: {
    conn: Connection;
    uid: string;
  }): Promise<ServiceResult> {
    try {
      const User = getUserModel(conn);
      const user = await User.findOne({ uid }).select('-password');

      if (!user) {
        return { success: false, message: 'User not found' };
      }

      return { success: true, data: user };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message:
          error instanceof Error
            ? `Failed to retrieve user: ${error.message}`
            : 'Internal server error occurred while retrieving user.',
      };
    }
  }

  static async getAll({
    conn,
    uid,
    role,
  }: {
    conn: Connection;
    uid: string | null;
    role: UnifiedUser['role'];
  }): Promise<ServiceResult<UnifiedUser[]>> {
    try {
      const queryMap: Record<UnifiedUser['role'], Record<string, unknown>> = {
        superadmin: {},
        moderator: {},
        ops: {},
        admin: {},
        doctor: {
          $nor: [{ role: 'admin' }],
        },
        nurse: {
          $nor: [{ role: 'admin' }],
        },
        receptionist: {
          $or: [{ role: 'patient' }, { role: 'receptionist' }, { role: 'doctor' }],
        },
        patient: {
          role: 'patient',
          uid,
        },
        pharmacist: {
          $nor: [{ role: 'admin' }],
        },
      };

      const User = getUserModel(conn);

      const users = await User.find(queryMap[role]).select('-password');

      return { success: true, data: users };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message:
          error instanceof Error
            ? `Failed to retrieve users: ${error.message}`
            : SERVER_ERROR_MESSAGE,
      };
    }
  }

  static async create({ conn, data }: { conn: Connection; data: $FixMe }): Promise<ServiceResult> {
    try {
      const { role, ...rest } = data;
      const User = getUserModel(conn);
      const existingUser = await User.findOne({ email: data.email });

      if (role === 'superadmin') {
        return {
          success: false,
          message: 'Superadmin cannot be created.',
        };
      }

      if (existingUser) {
        return {
          success: false,
          message: 'User already exists.',
        };
      }

      let hashedPassword;
      if (data.password) {
        hashedPassword = await bcrypt.hash(data.password, 10);
      }

      if (['superadmin', 'moderator', 'ops'].includes(role)) {
        const user = await User.create({
          ...rest,
          email: data.email,
          password: hashedPassword,
          role,
        });

        return {
          success: true,
          message: 'User created successfully.',
          data: user,
        };
      } else {
        const user = await User.create({
          ...rest,
          email: data.email,
          password: hashedPassword,
          role,
        });
        if (role === 'patient') {
          const Patient = getPatientModel(conn);
          const patient = await Patient.create({
            ...rest,
            uid: user.uid,
            phone: user.phone,
          });

          if (!patient) {
            await User.deleteOne({ _id: user._id });
            return {
              success: false,
              message: 'Failed to create patient.',
            };
          }
        }

        if (role === 'doctor') {
          const Doctor = getDoctorModel(conn);
          const doctor = await Doctor.create({
            ...rest,
            uid: user.uid,
          });

          if (!doctor) {
            await User.deleteOne({ _id: user._id });
            return {
              success: false,
              message: 'Failed to create doctor.',
            };
          }
        }

        return {
          success: true,
          message: 'User created successfully.',
          data: user,
        };
      }
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message:
          error instanceof Error ? `Failed to create user: ${error.message}` : SERVER_ERROR_MESSAGE,
      };
    }
  }

  static async update({
    conn,
    uid,
    data,
  }: {
    conn: Connection;
    uid: string;
    data: Partial<CreateUser>;
  }): Promise<ServiceResult<UnifiedUser>> {
    try {
      const { role, ...rest } = data;
      const User = getUserModel(conn);
      const user = await User.findOne({ uid });
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      if (user.role === 'superadmin') {
        return {
          success: false,
          message: 'Superadmin cannot be updated.',
        };
      }

      const updatedUser = await User.findOneAndUpdate(
        { uid },
        { $set: { ...rest } },
        { new: true }
      );

      if (!updatedUser) {
        return { success: false, message: 'Failed to update user' };
      }

      return { success: true, message: 'User updated successfully', data: updatedUser };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message:
          error instanceof Error ? `Failed to update user: ${error.message}` : SERVER_ERROR_MESSAGE,
      };
    }
  }

  static async delete({ conn, uid }: { conn: Connection; uid: string }): Promise<ServiceResult> {
    try {
      const User = getUserModel(conn);

      const user = await User.findOne({ uid });

      if (!user) {
        return { success: false, message: 'User not found' };
      }

      if (user.role === 'superadmin') {
        return {
          success: false,
          message: 'Superadmin cannot be deleted.',
        };
      }

      await User.deleteOne({ uid });

      if (user.role === 'patient') {
        const Patient = getPatientModel(conn);
        await Patient.deleteOne({ uid });
      }

      if (user.role === 'doctor') {
        const Doctor = getDoctorModel(conn);
        await Doctor.deleteOne({ uid });
      }

      return { success: true, message: 'User deleted successfully' };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message:
          error instanceof Error ? `Failed to delete user: ${error.message}` : SERVER_ERROR_MESSAGE,
      };
    }
  }
}

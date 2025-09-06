import { $FixMe } from '@/types';
import { ServiceResult } from '@/services';
import { Connection } from 'mongoose';
import { getUserModel } from '@/services/common/user/model';
import { SystemUser, UnifiedUser, CreateUser } from './types';
import { SYSTEM_USER_ROLE } from './constants';
import bcrypt from 'bcryptjs';
import { rolePermissions } from './permission';
import { SERVER_ERROR_MESSAGE } from '@/lib/constants';
import { getPatientModel } from '@/services/client/patient/model';
import { getDoctorModel } from '@/services/client/doctor/model';

export class UserService {
  static async getUserByUid({
    conn,
    uid,
    requesterRole,
    requesterUid,
  }: {
    conn: Connection;
    uid: string;
    requesterRole: UnifiedUser['role'];
    requesterUid: string | null;
  }): Promise<ServiceResult<UnifiedUser>> {
    try {
      const isPrimaryDb = conn.db?.databaseName === process.env.MONGODB_GLOBAL;

      if (isPrimaryDb && !SYSTEM_USER_ROLE.includes(requesterRole as SystemUser['role'])) {
        return {
          success: false,
          message: 'Access denied. System user privileges required.',
        };
      }

      const User = getUserModel(conn);

      // Find user by uid
      const user = await User.findOne({ uid }).select('-password');

      if (!user) {
        return {
          success: false,
          message: 'User not found.',
        };
      }

      // Permission checks for organization database
      if (!isPrimaryDb) {
        const allowedRoles = rolePermissions[requesterRole];

        // Check if requester can view this user's role
        if (!allowedRoles.includes(user.role)) {
          return {
            success: false,
            message: `Access denied. Insufficient permissions to view users with ${user.role} role.`,
          };
        }

        // Patients can only view themselves
        if (requesterRole === 'patient' && user.uid !== requesterUid) {
          return {
            success: false,
            message: 'Access denied. Patients can only view their own profile.',
          };
        }
      }

      return {
        success: true,
        message: 'User retrieved successfully.',
        data: user,
      };
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

      if (user.role === 'patient') {
        const Patient = getPatientModel(conn);
        const patient = await Patient.findOneAndUpdate(
          { uid },
          { $set: { ...rest } },
          { new: true }
        );

        if (!patient) {
          return { success: false, message: 'Failed to update patient' };
        }
      }

      if (user.role === 'doctor') {
        const Doctor = getDoctorModel(conn);
        const doctor = await Doctor.findOneAndUpdate({ uid }, { $set: { ...rest } }, { new: true });

        if (!doctor) {
          return { success: false, message: 'Failed to update doctor' };
        }
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

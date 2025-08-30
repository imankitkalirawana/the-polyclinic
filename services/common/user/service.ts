import { ServiceResult } from '@/services';
import { Connection } from 'mongoose';
import { getUserModel } from '@/models/User';
import { UnifiedUser } from './types';

export class UserService {
  static async getUsers({
    conn,
    role,
    uid,
  }: {
    conn: Connection;
    role: UnifiedUser['role'];
    uid: string | null;
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
        message: error instanceof Error ? error.message : 'Internal Server Error',
      };
    }
  }
}

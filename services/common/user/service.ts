import { ServiceResult } from '@/services';
import { Connection } from 'mongoose';
import { getUserModel } from '@/models/User';
import { SystemUser, UnifiedUser, CreateUser } from './types';
import { SYSTEM_USER_ROLE } from './constants';
import bcrypt from 'bcryptjs';
import { rolePermissions } from './permission';
import { SERVER_ERROR_MESSAGE } from '@/lib/constants';

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
      const isPrimaryDb = conn.db?.databaseName === process.env.MONGODB_GLOBAL;

      if (isPrimaryDb && !SYSTEM_USER_ROLE.includes(role as SystemUser['role'])) {
        return {
          success: false,
          message: 'Access denied. System user privileges required.',
        };
      }

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
            : 'Internal server error occurred while retrieving users.',
      };
    }
  }

  static async createUser({
    conn,
    data,
    creatorRole,
  }: {
    conn: Connection;
    data: CreateUser;
    creatorRole: UnifiedUser['role'];
  }): Promise<ServiceResult<UnifiedUser>> {
    try {
      const isPrimaryDb = conn.db?.databaseName === process.env.MONGODB_GLOBAL;
      const { email, password, organization, role = 'patient', ...rest } = data;

      // Permission checks
      if (isPrimaryDb) {
        if (!SYSTEM_USER_ROLE.includes(creatorRole as SystemUser['role'])) {
          return {
            success: false,
            message: 'Access denied. System user privileges required to create users.',
          };
        }

        if (organization) {
          return {
            success: false,
            message: 'System users cannot be assigned to organizations.',
          };
        }

        if (!SYSTEM_USER_ROLE.includes(role as SystemUser['role'])) {
          return {
            success: false,
            message: 'Invalid role for system user. Only system roles are allowed.',
          };
        }
      } else {
        const allowedRoles = rolePermissions[creatorRole];
        if (!allowedRoles.includes(role)) {
          return {
            success: false,
            message: `Access denied. Insufficient permissions to create users with ${role} role.`,
          };
        }
      }

      const User = getUserModel(conn);

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return {
          success: false,
          message: 'A user with this email address already exists.',
        };
      }

      // Hash password if provided
      let hashedPassword;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      const userData = {
        ...rest,
        email,
        role,
        ...(hashedPassword && { password: hashedPassword }),
        ...(organization && { organization }),
        status: 'active',
      };

      const user = await User.create(userData);

      const safeUser = user.toObject();
      delete safeUser.password;

      return {
        success: true,
        message: 'User created successfully.',
        data: safeUser,
      };
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message:
          error instanceof Error ? `Failed to create user: ${error.message}` : SERVER_ERROR_MESSAGE,
      };
    }
  }

  static async updateUser({
    conn,
    uid,
    data,
    updaterRole,
    updaterUid,
  }: {
    conn: Connection;
    uid: string;
    data: Partial<CreateUser>;
    updaterRole: UnifiedUser['role'];
    updaterUid: string | null;
  }): Promise<ServiceResult<UnifiedUser>> {
    try {
      const isPrimaryDb = conn.db?.databaseName === process.env.MONGODB_GLOBAL;
      const { email, password, organization, role, ...rest } = data;

      const User = getUserModel(conn);

      // Check if user exists
      const existingUser = await User.findOne({ uid });
      if (!existingUser) {
        return {
          success: false,
          message: 'User not found.',
        };
      }

      // Permission checks for primary database
      if (isPrimaryDb) {
        if (!SYSTEM_USER_ROLE.includes(updaterRole as SystemUser['role'])) {
          return {
            success: false,
            message: 'Access denied. System user privileges required.',
          };
        }

        if (role && !SYSTEM_USER_ROLE.includes(role as SystemUser['role'])) {
          return {
            success: false,
            message: 'Invalid role for system user. Only system roles are allowed.',
          };
        }
      } else {
        // Organization database permission checks
        const allowedRoles = rolePermissions[updaterRole];

        // Check if updater can modify this user's role
        if (role && !allowedRoles.includes(role)) {
          return {
            success: false,
            message: `Access denied. Insufficient permissions to assign ${role} role.`,
          };
        }

        // Check if updater can modify the existing user's role
        if (!allowedRoles.includes(existingUser.role)) {
          return {
            success: false,
            message: `Access denied. Insufficient permissions to modify users with ${existingUser.role} role.`,
          };
        }

        // Patients can only update themselves
        if (updaterRole === 'patient' && existingUser.uid !== updaterUid) {
          return {
            success: false,
            message: 'Access denied. Patients can only update their own profile.',
          };
        }
      }

      // Check for email conflicts (excluding current user)
      if (email && email !== existingUser.email) {
        const emailConflict = await User.findOne({
          email,
          uid: { $ne: uid },
        });
        if (emailConflict) {
          return {
            success: false,
            message: 'Email address is already in use by another user.',
          };
        }
      }

      // Prepare update data
      const updateData: Record<string, unknown> = { ...rest };

      if (email) updateData.email = email;
      if (role) updateData.role = role;
      if (organization !== undefined) updateData.organization = organization;

      // Hash new password if provided
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const updatedUser = await User.findOneAndUpdate({ uid }, updateData, {
        new: true,
        runValidators: true,
      }).select('-password');

      if (!updatedUser) {
        return {
          success: false,
          message: 'Failed to update user.',
        };
      }

      return {
        success: true,
        message: 'User updated successfully.',
        data: updatedUser,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message:
          error instanceof Error ? `Failed to update user: ${error.message}` : SERVER_ERROR_MESSAGE,
      };
    }
  }

  static async deleteUser({
    conn,
    uid,
    deleterRole,
  }: {
    conn: Connection;
    uid: string;
    deleterRole: UnifiedUser['role'];
  }): Promise<ServiceResult<{ deletedUser: UnifiedUser }>> {
    try {
      const isPrimaryDb = conn.db?.databaseName === process.env.MONGODB_GLOBAL;

      const User = getUserModel(conn);

      // Check if user exists
      const existingUser = await User.findOne({ uid }).select('-password');
      if (!existingUser) {
        return {
          success: false,
          message: 'User not found.',
        };
      }

      // Permission checks for primary database
      if (isPrimaryDb) {
        if (!SYSTEM_USER_ROLE.includes(deleterRole as SystemUser['role'])) {
          return {
            success: false,
            message: 'Access denied. System user privileges required.',
          };
        }

        // Prevent deleting other superadmins unless you're a superadmin
        if (existingUser.role === 'superadmin' && deleterRole !== 'superadmin') {
          return {
            success: false,
            message: 'Access denied. Only superadmins can delete other superadmin users.',
          };
        }
      } else {
        // Organization database permission checks
        const allowedRoles = rolePermissions[deleterRole];

        // Check if deleter can modify this user's role
        if (!allowedRoles.includes(existingUser.role)) {
          return {
            success: false,
            message: `Access denied. Insufficient permissions to delete users with ${existingUser.role} role.`,
          };
        }
      }

      const deletedUser = await User.findOneAndDelete({ uid });

      if (!deletedUser) {
        return {
          success: false,
          message: 'Failed to delete user.',
        };
      }

      return {
        success: true,
        message: 'User deleted successfully.',
      };
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

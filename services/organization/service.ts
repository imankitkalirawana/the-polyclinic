import { ServiceResult } from '@/services';
import { Connection } from 'mongoose';
import { getOrganizationModel } from '@/models/system/Organization';
import {
  CreateOrganizationType,
  OrganizationType,
  OrganizationUserType,
  UpdateOrganizationType,
} from '@/types/system/organization';
import { getUserModel } from '@/models/User';
import { connectDB } from '@/lib/db';
import { CreateOrganizationUserRequest, UpdateOrganizationUserRequest } from './validation';
import bcrypt from 'bcryptjs';

export class OrganizationService {
  static async getOrganizations(conn: Connection): Promise<ServiceResult<OrganizationType[]>> {
    try {
      const Organization = getOrganizationModel(conn);
      const organizations = await Organization.find().sort({ createdAt: -1 });

      return { success: true, data: organizations };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
        code: 500,
      };
    }
  }

  static async createOrganization(
    conn: Connection,
    data: CreateOrganizationType
  ): Promise<ServiceResult> {
    try {
      const { name, domain, logoUrl } = data;

      const Organization = getOrganizationModel(conn);

      const organization = new Organization({ name, domain, logoUrl, status: 'active' });
      await organization.save();

      return { success: true, message: 'Organization created successfully' };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
        code: 500,
      };
    }
  }

  static async getOrganization(
    conn: Connection,
    organizationId: string
  ): Promise<ServiceResult<OrganizationType>> {
    try {
      const Organization = getOrganizationModel(conn);
      const organization = await Organization.findOne({ organizationId });

      if (!organization) {
        return { success: false, message: 'Organization not found', code: 404 };
      }

      return { success: true, data: organization };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
        code: 500,
      };
    }
  }

  static async getOrganizationUsers(
    conn: Connection
  ): Promise<ServiceResult<OrganizationUserType[]>> {
    try {
      const User = getUserModel(conn);
      const users = await User.find().select('-password');

      return { success: true, data: users };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
        code: 500,
      };
    }
  }

  static async getFullOrganization(
    conn: Connection,
    organizationId: string
  ): Promise<ServiceResult<{ organization: OrganizationType; users: OrganizationUserType[] }>> {
    try {
      const Organization = getOrganizationModel(conn);
      const organization = await Organization.findOne({ organizationId });

      if (!organization) {
        return { success: false, message: 'Organization not found', code: 404 };
      }

      const conn2 = await connectDB(organizationId);

      const users = await this.getOrganizationUsers(conn2);
      if (!users.success) {
        return { success: false, message: users.message, code: users.code };
      }

      return { success: true, data: { organization, users: users.data || [] } };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
        code: 500,
      };
    }
  }

  static async updateOrganization(
    conn: Connection,
    organizationId: string,
    data: UpdateOrganizationType
  ): Promise<ServiceResult> {
    try {
      const Organization = getOrganizationModel(conn);
      const organization = await Organization.findOne({ organizationId });

      if (!organization) {
        return { success: false, message: 'Organization not found', code: 404 };
      }

      const updatedOrganization = await Organization.findOneAndUpdate(
        { organizationId },
        { $set: data },
        { new: true }
      );

      if (!updatedOrganization) {
        return { success: false, message: 'Failed to update organization', code: 500 };
      }

      return {
        success: true,
        message: 'Organization updated successfully',
        data: updatedOrganization,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
        code: 500,
      };
    }
  }

  static async deleteOrganization(
    conn: Connection,
    organizationId: string
  ): Promise<ServiceResult> {
    try {
      const Organization = getOrganizationModel(conn);
      const organization = await Organization.findOne({ organizationId });

      if (!organization) {
        return { success: false, message: 'Organization not found', code: 404 };
      }

      await Organization.deleteOne({ organizationId });

      return { success: true, message: 'Organization deleted successfully' };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
        code: 500,
      };
    }
  }

  // Organization User

  static async getOrganizationUser(
    conn: Connection,
    organizationId: string,
    userId: string
  ): Promise<ServiceResult<OrganizationUserType>> {
    try {
      const User = getUserModel(conn);
      const user = await User.findOne({ organization: organizationId, uid: userId });

      if (!user) {
        return { success: false, message: 'User not found', code: 404 };
      }

      return { success: true, data: user };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
        code: 500,
      };
    }
  }

  static async getOrganizationUserById(
    conn: Connection,
    userId: string
  ): Promise<ServiceResult<OrganizationUserType>> {
    try {
      const User = getUserModel(conn);
      const user = await User.findOne({ uid: userId }).select('-password');

      if (!user) {
        return { success: false, message: 'User not found', code: 404 };
      }

      return { success: true, data: user };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
        code: 500,
      };
    }
  }

  static async createOrganizationUser(
    conn: Connection,
    organizationId: string,
    data: CreateOrganizationUserRequest
  ): Promise<ServiceResult> {
    try {
      const { email, password, ...rest } = data;

      const User = getUserModel(conn);
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return { success: false, message: 'User already exists', code: 400 };
      }

      let hashedPassword;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      const user = await User.create({
        ...rest,
        email,
        password: hashedPassword,
        organization: organizationId,
      });

      return { success: true, message: 'User created successfully', data: user };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
        code: 500,
      };
    }
  }

  static async updateOrganizationUser(
    conn: Connection,
    organizationId: string,
    userId: string,
    data: UpdateOrganizationUserRequest
  ): Promise<ServiceResult> {
    try {
      const { email, password, ...rest } = data;

      const User = getUserModel(conn);
      const user = await User.findOne({ organization: organizationId, uid: userId });

      if (!user) {
        return { success: false, message: 'User not found', code: 404 };
      }

      let hashedPassword;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      const updatedUser = await User.findOneAndUpdate(
        { organization: organizationId, uid: userId },
        {
          $set: { ...rest, ...(email && { email }), ...(password && { password: hashedPassword }) },
        },
        { new: true }
      );

      if (!updatedUser) {
        return { success: false, message: 'Failed to update user', code: 500 };
      }

      return { success: true, message: 'User updated successfully', data: updatedUser };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
        code: 500,
      };
    }
  }

  static async deleteOrganizationUser(
    conn: Connection,
    organizationId: string,
    userId: string
  ): Promise<ServiceResult> {
    try {
      const User = getUserModel(conn);
      const user = await User.findOne({ organization: organizationId, uid: userId });

      if (!user) {
        return { success: false, message: 'User not found', code: 404 };
      }

      await User.deleteOne({ organization: organizationId, uid: userId });

      return { success: true, message: 'User deleted successfully' };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
        code: 500,
      };
    }
  }
}

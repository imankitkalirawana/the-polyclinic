import { ServiceResult } from '@/services';
import { Connection } from 'mongoose';
import { getOrganizationModel } from '@/models/system/Organization';
import { OrganizationType, OrganizationUserType } from '@/types/system/organization';
import { CreateOrganizationType } from './validation';
import { getUserModel } from '@/models/User';
import { connectDB } from '@/lib/db';

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
      const User = getUserModel(conn2);
      const users = await User.find();

      return { success: true, data: { organization, users } };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
        code: 500,
      };
    }
  }
}

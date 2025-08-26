import { connectDB } from '@/lib/db';
import { ServiceResult } from '@/services';
import { CreateOrganizationType } from '@/types/system/organization';

export class OrganizationService {
  static async createOrganization(
    organization: CreateOrganizationType,
    subdomain: string
  ): Promise<ServiceResult> {
    const conn = await connectDB(subdomain);

    return { success: true, message: 'Organization created successfully' };
  }
}

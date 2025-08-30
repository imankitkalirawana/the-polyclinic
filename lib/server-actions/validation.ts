'use server';

import { getUserModel } from '@/models/User';
import { connectDB } from '../db';
import { getOrganizationModel } from '@/models/system/Organization';

// validate organization id
export const validateOrganizationId = async (id?: string | null) => {
  if (!id) {
    return false;
  }
  const conn = await connectDB();
  const Organization = getOrganizationModel(conn);
  const organization = await Organization.findOne({ organizationId: id });
  return !!organization;
};

export const isOrganizationActive = async (id: string) => {
  const conn = await connectDB();
  const Organization = getOrganizationModel(conn);
  const organization = await Organization.findOne({ organizationId: id });
  return organization?.status === 'active';
};

export const getOrganization = async (subdomain: string) => {
  const conn = await connectDB();
  const Organization = getOrganizationModel(conn);
  const organization = await Organization.findOne({ organizationId: subdomain }).lean();
  return organization;
};

// validate user in organization
export const validateUserInOrganization = async (userId: string, organizationId: string) => {
  // check if organization exists
  const doesOrganizationExist = await validateOrganizationId(organizationId);
  if (!doesOrganizationExist) {
    return false;
  }

  const conn = await connectDB(organizationId);
  const User = getUserModel(conn);
  const user = await User.findOne({ uid: userId, organization: organizationId });
  return !!user;
};

export const isUserActive = async (userId: string, organizationId: string) => {
  const doesOrganizationExist = await validateOrganizationId(organizationId);
  if (!doesOrganizationExist) {
    return false;
  }

  const conn = await connectDB(organizationId);
  const User = getUserModel(conn);
  const user = await User.findOne({ uid: userId });
  return user?.status === 'active';
};

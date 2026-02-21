import { Base } from './common.types';

export type DepartmentFeature = {
  name: string;
  description?: string | null;
};

export type Department = Base & {
  did: string;
  name: string;
  description?: string | null;
  image?: string | null;
  features?: DepartmentFeature[] | null;
  status: 'active' | 'inactive';
  team?: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    image?: string;
    designation?: string;
  }>;
};

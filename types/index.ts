import { GENDERS } from '@/constants';
import { SystemUserType } from './control-plane';
import { OrganizationUserType } from './organization';
import { ValuesOf } from '@/lib/utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type $FixMe = any;

export type Base = {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
};

export type UnifiedUserType = SystemUserType | OrganizationUserType;

export type Gender = ValuesOf<typeof GENDERS>;

export interface CountryProps {
  id: number;
  name: string;
  iso2: string;
  iso3: string;
  phonecode: string;
  capital: string;
  currency: string;
  native: string;
  emoji: string;
}

export interface StateProps {
  id: number;
  name: string;
  country_id: number;
  country_code: string;
  iso2: string;
  type: string;
  latitude: string;
  longitude: string;
}

export interface CityProps {
  id: number;
  name: string;
}

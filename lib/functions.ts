const email = process.env.EMAIL || 'contact@divinely.dev';

import { countryProp } from '@/components/dashboard/users/edit/countries';

export const phoneValidate = (phone: string) => {
  if (/^[0-9]{10}$/.test(phone)) {
    return phone;
  } else if (/^91[0-9]{10}$/.test(phone)) {
    return phone.replace(/^91/, '');
  } else if (/^\+91[0-9]{10}$/.test(phone)) {
    return phone.replace(/^\+91/, '');
  } else {
    return null;
  }
};

export const transformCountries = (data: any[]): countryProp[] => {
  return data.map((country) => ({
    name: country.name.common,
    code: country.cca2,
  }));
};

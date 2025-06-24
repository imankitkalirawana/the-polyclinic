'use server';
import { CityProps, CountryProps, StateProps } from '@/types';

import { fetchData } from '.';

export const getAllCountries = async () => {
  return await fetchData<CountryProps[]>('/countries', {
    baseUrl: 'https://api.countrystatecity.in/v1',
    headers: {
      'X-CSCAPI-KEY': process.env.NEXT_PUBLIC_CSCAPI_KEY,
    },
  });
};

export const getAllStatesByCountry = async (country: CountryProps['iso2']) => {
  return await fetchData<StateProps[]>(`/countries/${country}/states`, {
    baseUrl: 'https://api.countrystatecity.in/v1',
    headers: {
      'X-CSCAPI-KEY': process.env.NEXT_PUBLIC_CSCAPI_KEY,
    },
  });
};

export const getAllCitiesByCountryAndState = async (
  country: CountryProps['iso2'],
  state: StateProps['iso2']
) => {
  return await fetchData<CityProps[]>(
    `/countries/${country}/states/${state}/cities`,
    {
      baseUrl: 'https://api.countrystatecity.in/v1',
      headers: {
        'X-CSCAPI-KEY': process.env.NEXT_PUBLIC_CSCAPI_KEY,
      },
    }
  );
};

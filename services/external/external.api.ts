'use server';

import { apiRequest } from '@/libs/axios';
import { CityProps, CountryProps, StateProps } from '@/types';

export const getAllCountries = async () =>
  await apiRequest<CountryProps[]>({
    url: '/countries',
    baseURL: 'https://api.countrystatecity.in/v1',
    headers: {
      'X-CSCAPI-KEY': process.env.NEXT_PUBLIC_CSCAPI_KEY,
    },
  });

export const getAllStatesByCountry = async (country: CountryProps['iso2']) =>
  await apiRequest<StateProps[]>({
    url: `/countries/${country}/states`,
    baseURL: 'https://api.countrystatecity.in/v1',
    headers: {
      'X-CSCAPI-KEY': process.env.NEXT_PUBLIC_CSCAPI_KEY,
    },
  });

export const getAllCitiesByCountryAndState = async (
  country: CountryProps['iso2'],
  state: StateProps['iso2']
) =>
  await apiRequest<CityProps[]>({
    url: `/countries/${country}/states/${state}/cities`,
    baseURL: 'https://api.countrystatecity.in/v1',
    headers: {
      'X-CSCAPI-KEY': process.env.NEXT_PUBLIC_CSCAPI_KEY,
    },
  });

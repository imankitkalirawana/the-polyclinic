'use server';

import { fetchData } from '../fetch';

import { CityProps, CountryProps, StateProps } from '@/types';

export const getAllCountries = async () =>
  await fetchData<CountryProps[]>('/countries', {
    baseUrl: 'https://api.countrystatecity.in/v1',
    headers: {
      'X-CSCAPI-KEY': process.env.NEXT_PUBLIC_CSCAPI_KEY,
    },
  });

export const getAllStatesByCountry = async (country: CountryProps['iso2']) =>
  await fetchData<StateProps[]>(`/countries/${country}/states`, {
    baseUrl: 'https://api.countrystatecity.in/v1',
    headers: {
      'X-CSCAPI-KEY': process.env.NEXT_PUBLIC_CSCAPI_KEY,
    },
  });

export const getAllCitiesByCountryAndState = async (
  country: CountryProps['iso2'],
  state: StateProps['iso2']
) =>
  await fetchData<CityProps[]>(`/countries/${country}/states/${state}/cities`, {
    baseUrl: 'https://api.countrystatecity.in/v1',
    headers: {
      'X-CSCAPI-KEY': process.env.NEXT_PUBLIC_CSCAPI_KEY,
    },
  });

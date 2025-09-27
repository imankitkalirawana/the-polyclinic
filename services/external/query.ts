import { useQuery } from '@tanstack/react-query';

import {
  getAllCitiesByCountryAndState,
  getAllCountries,
  getAllStatesByCountry,
} from '@/services/external/api';

import { CountryProps, StateProps } from '@/types';

export const useAllCountries = () =>
  useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const res = await getAllCountries();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

export const useAllStatesByCountry = (country: CountryProps['iso2']) =>
  useQuery({
    queryKey: ['states', country],
    queryFn: async () => {
      const res = await getAllStatesByCountry(country);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
    enabled: !!country,
  });

export const useAllCitiesByCountryAndState = (
  country: CountryProps['iso2'],
  state: StateProps['iso2']
) =>
  useQuery({
    queryKey: ['cities', country, state],
    queryFn: async () => {
      const res = await getAllCitiesByCountryAndState(country, state);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
    enabled: !!country && !!state,
  });

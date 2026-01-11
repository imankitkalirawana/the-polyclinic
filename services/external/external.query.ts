import { useQuery } from '@tanstack/react-query';

import {
  getAllCitiesByCountryAndState,
  getAllCountries,
  getAllStatesByCountry,
} from '@/services/external/external.api';

import { CountryProps, StateProps } from '@/types';

export const useAllCountries = () =>
  useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const result = await getAllCountries();
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    },
  });

export const useAllStatesByCountry = (country: CountryProps['iso2']) =>
  useQuery({
    queryKey: ['states', country],
    queryFn: async () => {
      const result = await getAllStatesByCountry(country);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
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
      const result = await getAllCitiesByCountryAndState(country, state);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    },
    enabled: !!country && !!state,
  });

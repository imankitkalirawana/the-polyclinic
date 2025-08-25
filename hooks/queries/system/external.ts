import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  getAllCitiesByCountryAndState,
  getAllCountries,
  getAllStatesByCountry,
} from '../../../services/api/system/external';

import { CityProps, CountryProps, StateProps } from '@/types';

export const useAllCountries = (): UseQueryResult<CountryProps[]> =>
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

export const useAllStatesByCountry = (
  country: CountryProps['iso2']
): UseQueryResult<StateProps[]> =>
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
): UseQueryResult<CityProps[]> =>
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

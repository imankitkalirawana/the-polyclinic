import { CityProps, CountryProps, StateProps } from '@/types';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import {
  getAllCitiesByCountryAndState,
  getAllCountries,
  getAllStatesByCountry,
} from './api/external';

export const useAllCountries = (): UseQueryResult<CountryProps[]> => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const res = await getAllCountries();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });
};

export const useAllStatesByCountry = (
  country: CountryProps['iso2']
): UseQueryResult<StateProps[]> => {
  return useQuery({
    queryKey: ['states', country],
    queryFn: async () => {
      const res = await getAllStatesByCountry(country);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });
};

export const useAllCitiesByCountryAndState = (
  country: CountryProps['iso2'],
  state: StateProps['iso2']
): UseQueryResult<CityProps[]> => {
  return useQuery({
    queryKey: ['cities', country, state],
    queryFn: async () => {
      const res = await getAllCitiesByCountryAndState(country, state);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });
};

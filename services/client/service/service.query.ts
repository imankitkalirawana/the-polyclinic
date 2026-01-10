import { ServiceApi } from '@/services/client/service/service.api';
import { ServiceType } from '@/services/client/service/service.types';

import { useGenericQuery } from '@/services/useGenericQuery';
import { useGenericMutation } from '@/services/useGenericMutation';

export const useAllServices = () =>
  useGenericQuery({
    queryKey: ['services'],
    queryFn: () => ServiceApi.getAll(),
  });

export const useServiceWithUID = (uid: string) =>
  useGenericQuery({
    queryKey: ['service', uid],
    queryFn: () => ServiceApi.getByUID(uid),
    enabled: !!uid,
  });

export const useCreateService = () => {
  return useGenericMutation({
    mutationFn: (data: ServiceType) => ServiceApi.create(data),
    invalidateQueries: [['services']],
  });
};

export const useUpdateService = () => {
  return useGenericMutation({
    mutationFn: (data: ServiceType) => ServiceApi.update(data.uniqueId, data),
    invalidateQueriesWithVariables: ({ variables }) => [
      ['services'],
      ['service', variables?.uniqueId],
    ],
  });
};

export const useDeleteService = () => {
  return useGenericMutation({
    mutationFn: (uid: string) => ServiceApi.delete(uid),
    invalidateQueries: [['services']],
  });
};

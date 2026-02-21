import { $FixMe } from '@/types';
import { DoctorApi, DoctorSlots } from './doctor.api';
import { useGenericQuery } from '@/services/useGenericQuery';
import { useGenericMutation } from '@/services/useGenericMutation';
import { useCollectionQuery, useIndexedQuery } from '@/store/cache';

export const useAllDoctors = (search?: string) =>
  useCollectionQuery({
    queryKey: ['doctors', search],
    queryFn: () => DoctorApi.getAll(search),
    cacheKey: 'doctors',
  });

export const useDoctorByIdQuery = (id?: string | null) =>
  useIndexedQuery({
    queryKey: ['doctor', id],
    queryFn: () => DoctorApi.getById(id),
    indexKey: 'doctorById',
    entityId: id,
    enabled: !!id,
  });

export const useDoctorById = useDoctorByIdQuery;

export const useSlotsByUID = (uid: string) =>
  useGenericQuery({
    queryKey: ['slots', uid],
    queryFn: () => DoctorSlots.getSlotsByUID(uid),
    enabled: !!uid,
  });

export const useUpdateSlots = (uid: string) => {
  return useGenericMutation({
    mutationFn: (slot: $FixMe) => DoctorSlots.updateSlotsByUID(uid, slot),
    invalidateQueries: [['slots', uid]],
  });
};

export const useSpecializations = () =>
  useCollectionQuery({
    queryKey: ['specializations'],
    queryFn: () => DoctorApi.getSpecializations(),
    cacheKey: 'specializations',
  });

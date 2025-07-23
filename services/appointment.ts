import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { AppointmentType, CreateAppointmentType } from '@/types/appointment';
import {
  createAppointment,
  getAllAppointments,
  getAppointmentWithAID,
} from './api/appointment';
import { ApiResponse } from './api';

export const useAllAppointments = (): UseQueryResult<AppointmentType[]> => {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const res = await getAllAppointments();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });
};

export const useAppointmentWithAID = (
  aid: number
): UseQueryResult<AppointmentType> => {
  return useQuery({
    queryKey: ['appointment', aid],
    queryFn: async () => {
      const res = await getAppointmentWithAID(aid);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
    enabled: !!aid,
  });
};

// POST

export const useCreateAppointment = (): UseMutationResult<
  ApiResponse<AppointmentType>,
  Error,
  CreateAppointmentType
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (appointment: CreateAppointmentType) => {
      const res = await createAppointment(appointment);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

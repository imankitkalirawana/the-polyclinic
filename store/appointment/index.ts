import { AppointmentType } from '@/types/appointment';
import { DoctorType } from '@/types/doctor';
import { UserType } from '@/types/user';
import { useFormik } from 'formik';

export const useNewAppointmentForm = (session: any) => {
  const appointmentForm = useFormik({
    initialValues: {
      patient: {
        uid: session?.user?.uid,
        name: session?.user?.name,
        email: session?.user?.email,
        image: session?.user?.picture || session?.user?.image,
      } as UserType,
      doctor: {} as DoctorType,
      appointment: {} as AppointmentType,
      date: new Date(),
      additionalInfo: {
        notes: '',
        type: 'online',
        symptoms: '',
      },
      step: 1,
    },

    onSubmit: async (values) => {
      console.log(values);
    },
  });

  return { appointmentForm };
};

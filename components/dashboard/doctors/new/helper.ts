import * as Yup from 'yup';

export const doctorValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(3, 'Name is too short')
    .max(50, 'Name is too long'),
  email: Yup.string().email('Invalid email'),
  phone: Yup.string().required('Phone number is required'),
  gender: Yup.string().required('Gender is required'),
});

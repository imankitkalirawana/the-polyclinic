import * as Yup from 'yup';

export const serviceValidationSchema = Yup.object().shape({
  service: Yup.object().shape({
    uniqueId: Yup.string().required('Unique ID is required'),
    name: Yup.string()
      .required('Name is required')
      .min(3, 'Name is too short')
      .max(50, 'Name is too long'),
    description: Yup.string().required('Description is required'),
    price: Yup.number()
      .required('Price is required')
      .min(1, 'Price is too low'),
    duration: Yup.number()
      .required('Duration is required')
      .min(1, 'Duration is too low'),
    status: Yup.string().required('Status is required')
  })
});

export const userValidationSchema = Yup.object().shape({
  user: Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .min(3, 'Name is too short')
      .max(50, 'Name is too long'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    role: Yup.string().required('Role is required'),
    phone: Yup.string().required('Phone number is required')
  })
});

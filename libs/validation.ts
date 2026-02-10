import * as Yup from 'yup';

export const serviceValidationSchema = Yup.object().shape({
  uniqueId: Yup.string().required('Unique ID is required'),
  name: Yup.string()
    .required('Name is required')
    .min(3, 'Name is too short')
    .max(50, 'Name is too long'),
  description: Yup.string().required('Description is required'),
  price: Yup.number().required('Price is required').min(1, 'Price is too low'),
  duration: Yup.number().required('Duration is required').min(1, 'Duration is too low'),
  status: Yup.string().required('Status is required'),
});

export const drugValidationSchema = Yup.object().shape({
  did: Yup.number().required('Drug ID is required'),
  brandName: Yup.string()
    .required('Brand Name is required')
    .min(3, 'Brand Name is too short')
    .max(50, 'Brand Name is too long'),
  genericName: Yup.string()
    .required('Generic Name is required')
    .min(3, 'Generic Name is too short')
    .max(50, 'Generic Name is too long'),
});

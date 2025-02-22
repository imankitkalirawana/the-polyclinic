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
    email: Yup.string().matches(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      'Invalid email'
    ),
    phone: Yup.string().required('Phone number is required'),
    gender: Yup.string().required('Gender is required')
  }),
  age: Yup.number().required('Age is required')
});

export const drugValidationSchema = Yup.object().shape({
  drug: Yup.object().shape({
    brandName: Yup.string()
      .required('Brand Name is required')
      .min(3, 'Brand Name is too short')
      .max(50, 'Brand Name is too long'),
    genericName: Yup.string()
      .required('Generic Name is required')
      .min(3, 'Generic Name is too short')
      .max(50, 'Generic Name is too long')
  })
});

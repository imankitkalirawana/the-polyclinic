import * as Yup from 'yup';

export const registerSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(20, 'Name must be less than 20 characters'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  otp: Yup.string().when('step', {
    is: 2,
    then: (schema) => schema.required('OTP is required'),
    otherwise: (schema) => schema,
  }),
  password: Yup.string().when('isValidation', {
    is: true,
    then: (schema) =>
      schema
        .required('Password is required')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),
    otherwise: (schema) => schema.required('Password is required'),
  }),
});

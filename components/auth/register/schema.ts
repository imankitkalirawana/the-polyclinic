import * as Yup from 'yup';

export const registerSchema = Yup.object().shape({
  name: Yup.string().when('page', {
    is: 2,
    then: (schema) => schema.required('Name is required'),
    otherwise: (schema) => schema,
  }),
  email: Yup.string()
    .email('Invalid email')
    .when('page', {
      is: 1,
      then: (schema) => schema.required('Email is required'),
      otherwise: (schema) => schema,
    }),
  otp: Yup.string().when('page', {
    is: 3,
    then: (schema) => schema.required('OTP is required'),
    otherwise: (schema) => schema,
  }),
  password: Yup.string().when('page', {
    is: 4,
    then: (schema) =>
      schema
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        )
        .required('Password is required'),
    otherwise: (schema) => schema,
  }),
});

export const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 20 : -20,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 20 : -20,
    opacity: 0,
  }),
};

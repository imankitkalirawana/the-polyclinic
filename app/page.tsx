'use client';
import { withZodSchema } from '@/lib/utils';
import { Button, Input } from '@heroui/react';
import { Formik, Form } from 'formik';
import { z } from 'zod';

// Define the form values type
interface FormValues {
  email: string;
  password: string;
  age: string;
}

// Define Zod schema
const validationSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  age: z.string().min(1, 'Age is required'),
});

export default function MyForm() {
  return (
    <Formik<FormValues>
      initialValues={{
        email: '',
        password: '',
        age: '',
      }}
      validate={withZodSchema(validationSchema)}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ values, errors, touched, handleChange }) => (
        <Form className="flex flex-col gap-4">
          <Input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            isInvalid={touched.email && !!errors.email}
            errorMessage={touched.email && errors.email}
            label="Email"
          />

          <Input
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            isInvalid={touched.password && !!errors.password}
            errorMessage={touched.password && errors.password}
            label="Password"
          />

          <Input
            name="age"
            value={values.age}
            onChange={handleChange}
            isInvalid={touched.age && !!errors.age}
            errorMessage={touched.age && errors.age}
            label="Age"
          />

          <Button type="submit" color="primary">
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
}

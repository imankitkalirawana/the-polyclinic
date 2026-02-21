import { z } from 'zod';

export const nullableStringValidation = z
  .string({ error: 'Only strings are allowed.' })
  .trim()
  .nullable()
  .optional();

export const nullableNumberValidation = z.number().nullable().optional();
export const nullablePositiveNumberValidation = z
  .number({ error: 'Only numeric values are allowed.' })
  .int({ error: 'Only integer values are allowed.' })
  .positive({ error: 'Only positive numbers are allowed.' })
  .nullable()
  .optional();
export const nullableIntegerValidation = z.number().int().nullable().optional();

export const nameValidation = z
  .string()
  .trim()
  .min(3, { error: 'Name cannot be empty.' })
  .max(50, { error: 'Name cannot be more than 50 characters.' });

export const emailValidation = z.email({ error: 'Invalid email address.' }).trim();

export const phoneNumberValidation = z
  .string()
  .trim()
  .transform((val) => (val === '' ? undefined : val))
  .superRefine((val, ctx) => {
    if (val === undefined) return;
    if (val.length !== 10) {
      ctx.addIssue({
        code: 'custom',
        message: 'Phone number must be 10 digits.',
      });
      return;
    }
    if (!/^[6-9]\d{9}$/.test(val)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Invalid phone number.',
      });
    }
  });

export const passwordValidation = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters' });

export const otpValidation = z
  .string()
  .length(6, { message: 'OTP must be 6 digits' })
  .regex(/^\d{6}$/, { message: 'OTP must contain only digits' });

import { faker } from '@faker-js/faker';
import { z } from 'zod';
import { GENDERS } from './constants';
import { CalendarDate } from '@internationalized/date';

export const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
export const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'thepolyclinic.app';

export const excludedSubdomains = ['www', 'staging', 'api'];

export type ValuesOf<T> = T extends readonly unknown[] ? T[number] : T[keyof T];

/**
 * @deprecated Avoid using this unless absolutely necessary.
 * This function forcefully casts data to the specified type,
 * which may lead to runtime errors and break the UI if the data shape is incorrect.
 */
export function castData<T>(data: unknown): T {
  return data as T;
}

export function generatePhoneNumber(): string {
  const startingDigits = ['6', '7', '8', '9'];
  const firstDigit = startingDigits[Math.floor(Math.random() * startingDigits.length)];

  let phoneNumber = firstDigit;

  for (let i = 0; i < 9; i++) {
    phoneNumber += Math.floor(Math.random() * 10).toString();
  }

  return phoneNumber;
}

export function generateEmail(name: string, provider = 'thepolyclinic.app') {
  return faker.internet
    .email({
      firstName: name,
      provider,
    })
    .toLowerCase();
}

export function toSnakeCase(str: string) {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

export function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function isSearchMatch(haystack: string, needle: string) {
  return haystack?.toLowerCase()?.trim()?.includes(needle?.toLowerCase()?.trim());
}

export function withZodSchema<T>(schema: z.ZodSchema<T>) {
  return (values: T) => {
    try {
      schema.parse(values);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path.length > 0) {
            const field = issue.path[0] as string;
            errors[field] = issue.message;
          }
        });
        return errors;
      }
      return {};
    }
  };
}

type SuccessResult<T> = readonly [T, null];
type ErrorResult<E = Error> = readonly [null, E];

type Result<T, E = Error> = SuccessResult<T> | ErrorResult<E>;

export async function tryCatch<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return [data, null] as const;
  } catch (error) {
    process.env.NODE_ENV !== 'production' && console.error('error', error);
    return [null, error as E] as const;
  }
}

export function extractFirstName(fullName: string): string {
  let cleaned = fullName.trim().replace(/\s+/g, ' ');

  const titles = ['mr', 'mrs', 'ms', 'miss', 'dr', 'prof', 'sir', 'madam'];
  const regex = new RegExp(`^((?:${titles.join('|')})\\.?\\s+)+`, 'i');

  const isDoctor = /^((dr)\.?)/i.test(cleaned);

  cleaned = cleaned.replace(regex, '').trim();

  const firstName = cleaned.split(' ')[0];

  const formattedFirst = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  return isDoctor ? `Dr. ${formattedFirst}` : formattedFirst;
}

/**
 * Converts strings like "on_hold" or "on-hold" to "On Hold"
 * Handles underscores, hyphens, and mixed casing.
 */
export function formatLabel(text: string): string {
  if (!text) return '';

  return text
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatAge(
  age: number | null | undefined,
  {
    fullString = false,
  }: {
    fullString?: boolean;
  } = {}
): string {
  if (!age) return '-';
  return fullString
    ? `${age} ${age === 1 ? 'year' : 'years'}`
    : `${age} ${age === 1 ? 'yr' : 'yrs'}`;
}

export function formatGender(
  gender: GENDERS | null | undefined,
  {
    fullString = false,
  }: {
    fullString?: boolean;
  } = {}
): string {
  if (!gender) return '-';
  return fullString
    ? gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase()
    : gender.charAt(0).toUpperCase();
}

export function handleDateChange(value: CalendarDate | null) {
  if (!value) {
    return;
  }

  const dob = new Date(value as unknown as Date).toISOString();
  return dob;
}

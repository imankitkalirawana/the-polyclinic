import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { faker } from '@faker-js/faker';
import { z } from 'zod';

export const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
export const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'lvh.me:3000';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

export type ValuesOf<T> = T extends readonly unknown[] ? T[number] : T[keyof T];

export function castData<T>(data: unknown): T {
  return data as T;
}

// Case
export function toCapitalCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
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

export function generateEmail(name: string) {
  return faker.internet
    .email({
      firstName: name,
      provider: 'divinely.dev',
    })
    .toLowerCase();
}

export function toSnakeCase(str: string) {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

export function toTitleCase(str: string) {
  return str.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export function isSearchMatch(haystack: string, needle: string) {
  return haystack?.toLowerCase().trim().includes(needle?.toLowerCase().trim());
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

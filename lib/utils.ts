import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { faker } from '@faker-js/faker';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

export type ValuesOf<T> = T extends readonly any[] ? T[number] : T[keyof T];

export function castData<T>(data: unknown): T {
  return data as T;
}

// Case
export function toCapitalCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function generatePhoneNumber(): string {
  const startingDigits = ['6', '7', '8', '9'];
  const firstDigit =
    startingDigits[Math.floor(Math.random() * startingDigits.length)];

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

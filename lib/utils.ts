import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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

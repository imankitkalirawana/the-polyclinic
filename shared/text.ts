import { BloodType, Gender } from '@enums/index';

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
  gender: Gender | null | undefined,
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

export function formatBloodType(bloodType: BloodType | null | undefined) {
  if (!bloodType) return '-';
  return bloodType.replace('_POSITIVE', '+').replace('_NEGATIVE', '-');
}

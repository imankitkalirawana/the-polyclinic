import { format } from 'date-fns';

/**
 * Safe date validation utility
 */
export const isValidDate = (date: unknown): date is Date | string => {
  if (!date) return false;
  if (date === '') return false; // Empty string is not a valid date
  const dateObj = new Date(date as string | Date);
  return !isNaN(dateObj.getTime());
};

/**
 * Safe date formatting with fallback
 */
export const safeFormat = (
  date: unknown, 
  formatString: string, 
  fallback = 'Invalid Date'
): string => {
  if (!isValidDate(date)) return fallback;
  
  try {
    return format(new Date(date), formatString);
  } catch (error) {
    console.warn('Date formatting error:', error, 'for date:', date);
    return fallback;
  }
};

/**
 * Safe date creation with validation
 */
export const safeCreateDate = (date: unknown): Date | null => {
  if (!isValidDate(date)) return null;
  
  try {
    const dateObj = new Date(date as string | Date);
    return isNaN(dateObj.getTime()) ? null : dateObj;
  } catch {
    return null;
  }
};

/**
 * Get a safe date or fallback to current date
 */
export const getDateOrFallback = (date: unknown, fallback = new Date()): Date => {
  const safeDate = safeCreateDate(date);
  return safeDate || fallback;
};
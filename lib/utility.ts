export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(price)
    .toString();
};

// function to check if the file type is an image or not
export const isImage = (filename: string) => {
  if (!filename) return false;
  const ext = filename.split('.').pop();
  if (
    ext === 'jpg' ||
    ext === 'jpeg' ||
    ext === 'png' ||
    ext === 'gif' ||
    ext === 'webp'
  ) {
    return true;
  }
  return false;
};

export const humanReadableDate = (
  date: string | Date,
  format: 'full' | 'day-month' = 'full'
) => {
  const options: Intl.DateTimeFormatOptions =
    format === 'day-month'
      ? { day: 'numeric', month: 'short' }
      : { day: 'numeric', month: 'short', year: 'numeric' };

  return new Date(date).toLocaleDateString('en-US', options);
};

export const humanReadableTime = (date: string | Date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
};

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const convertMinutesToHoursAndMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60); // Get the number of hours
  const remainingMinutes = minutes % 60; // Get the remaining minutes

  const hourPart = hours > 0 ? `${hours} hr${hours > 1 ? 's' : ''}` : '';
  const minutePart =
    remainingMinutes > 0
      ? `${remainingMinutes} min${remainingMinutes > 1 ? 's' : ''}`
      : '';

  return `${hourPart} ${minutePart}`;
};

// flatten object
export const flattenObject = (obj: any, prefix = ''): Record<string, any> => {
  return Object.keys(obj || {}).reduce(
    (acc: Record<string, any>, key: string) => {
      const propKey = prefix ? `${prefix}.${key}` : key;
      if (
        typeof obj[key] === 'object' &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        Object.assign(acc, flattenObject(obj[key], propKey));
      } else {
        acc[propKey] = obj[key];
      }
      return acc;
    },
    {}
  );
};

/**
 * Track changes between original and updated objects
 * Returns an object with changed fields and their differences
 *
 * @param originalObj - The original object before changes
 * @param updatedObj - The updated object after changes
 * @returns An object containing tracked changes
 */
export const trackObjectChanges = (
  originalObj: any,
  updatedObj: any
): {
  changedFields: string[];
  fieldDiffs: Record<string, { old: any; new: any }>;
} => {
  // Convert mongoose documents to plain objects if needed
  const original =
    typeof originalObj?.toObject === 'function'
      ? originalObj.toObject()
      : originalObj;
  const updated =
    typeof updatedObj?.toObject === 'function'
      ? updatedObj.toObject()
      : updatedObj;

  // Flatten both objects
  const flattenedOriginal = flattenObject(original);
  const flattenedUpdated = flattenObject(updated);

  // Find all changed fields, including nested ones
  const changedFields = Object.keys(flattenedUpdated).filter(
    (key) =>
      JSON.stringify(flattenedOriginal[key]) !==
      JSON.stringify(flattenedUpdated[key])
  );

  // Create a diff object with old and new values
  const fieldDiffs = changedFields.reduce(
    (acc, field) => {
      acc[field] = {
        old: flattenedOriginal[field],
        new: flattenedUpdated[field],
      };
      return acc;
    },
    {} as Record<string, { old: any; new: any }>
  );

  return { changedFields, fieldDiffs };
};

// TODO: be removed after migration
export const convertMinutesToHoursAndMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60); // Get the number of hours
  const remainingMinutes = minutes % 60; // Get the remaining minutes

  const hourPart = hours > 0 ? `${hours} hr${hours > 1 ? 's' : ''}` : '';
  const minutePart =
    remainingMinutes > 0 ? `${remainingMinutes} min${remainingMinutes > 1 ? 's' : ''}` : '';

  return `${hourPart} ${minutePart}`;
};

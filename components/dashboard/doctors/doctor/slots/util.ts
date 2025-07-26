export function generateTimeOptions(duration: number, startHour = 0, endHour = 24): string[] {
  const options: string[] = [];
  const totalMinutes = endHour * 60;

  for (let minutes = startHour * 60; minutes < totalMinutes; minutes += duration) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const timeString = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    options.push(timeString);
  }

  return options;
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

export function getValidEndTimes(
  startTime: string,
  duration: number,
  appointmentDuration: number
): string[] {
  if (!startTime) return [];

  const startMinutes = timeToMinutes(startTime);
  const minEndMinutes = startMinutes + appointmentDuration;

  return generateTimeOptions(duration, 0, 24).filter((time) => {
    const timeMinutes = timeToMinutes(time);
    return timeMinutes >= minEndMinutes;
  });
}

export function getValidStartTimes(duration: number, previousSlotEndTime?: string): string[] {
  const allTimes = generateTimeOptions(duration, 6, 22);

  if (!previousSlotEndTime) return allTimes;

  const previousEndMinutes = timeToMinutes(previousSlotEndTime);

  return allTimes.filter((time) => {
    const timeMinutes = timeToMinutes(time);
    return timeMinutes >= previousEndMinutes;
  });
}

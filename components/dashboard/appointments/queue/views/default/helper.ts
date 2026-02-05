import { AppointmentQueueFilters } from '@/services/client/appointment/queue/queue.types';

/**
 * Decides if a single filter value is "active" based on its shape.
 * Does not recurse into objects (avoids counting CalendarDate internals).
 * Add new value shapes here only when introducing a new filter value type.
 */
function isFilterValueActive(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === 'string') return value !== '';
  if (typeof value === 'number' || typeof value === 'boolean') return true;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if ('start' in obj || 'end' in obj) return obj.start != null || obj.end != null;
    return false;
  }
  return false;
}

export const getActiveFilterCount = (filters: AppointmentQueueFilters): number =>
  (Object.keys(filters) as Array<keyof AppointmentQueueFilters>).filter((key) =>
    isFilterValueActive(filters[key])
  ).length;

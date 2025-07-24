export interface TimeSlot {
  id: string;
  start: string;
  end: string;
}

export interface DaySchedule {
  enabled: boolean;
  slots: TimeSlot[];
}

export interface WeeklySchedule {
  sunday: DaySchedule;
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  [key: string]: DaySchedule;
}

export interface SchedulingWindow {
  type: 'available_now' | 'date_range';
  maxAdvanceDays: number | null;
  minAdvanceHours: number | null;
  startDate?: string;
  endDate?: string;
}

export interface GuestPermissions {
  canInviteOthers: boolean;
}

export interface AppointmentConfig {
  title: string;
  duration: number; // in minutes
  availability: {
    type: 'weekly' | 'custom';
    schedule: WeeklySchedule;
  };
  schedulingWindow: SchedulingWindow;
  bufferTime: number; // in minutes
  maxBookingsPerDay: number | null;
  guestPermissions: GuestPermissions;
  timezone: string;
}

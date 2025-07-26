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

export interface GuestPermissions {
  canInviteOthers: boolean;
}

export interface SpecificDateAvailability {
  date: string;
  enabled: boolean;
  slots: TimeSlot[];
}

export interface SlotConfig {
  uid?: number;
  title?: string;
  duration: number;
  availability: {
    type: 'weekly' | 'custom';
    schedule: WeeklySchedule;
    specificDates: SpecificDateAvailability[];
  };
  bufferTime: number;
  maxBookingsPerDay: number | null;
  guestPermissions: GuestPermissions;
  timezone: string;
}

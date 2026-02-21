import { Base } from './common.types';

export type Doctor = Base & {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  image?: string;
  departments?: string[];
  specializations?: DoctorSpecialization[];
  designation?: string;
  experience?: number;
  education?: string;
  biography?: string;
  seating?: string;
};

export type DoctorSpecialization = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TimeSlot = {
  id: string;
  start: string;
  end: string;
};

export type DaySchedule = {
  enabled: boolean;
  slots: TimeSlot[];
};

export type WeeklySchedule = {
  sunday: DaySchedule;
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  [key: string]: DaySchedule;
};

export type GuestPermissions = {
  canInviteOthers: boolean;
};

export type SpecificDateAvailability = {
  date: string;
  enabled: boolean;
  slots: TimeSlot[];
};

export type SlotConfig = {
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
};

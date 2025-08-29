import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import Appointment from '@/services/client/appointment/model';
import Slot from '@/models/client/Slot';
import { $FixMe } from '@/types';

// Helper function to get day name from date
function getDayName(date: string): string {
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dateObj = new Date(date);
  return dayNames[dateObj.getUTCDay()]; // Use getUTCDay for consistency
}

// Helper function to parse time string to minutes
function parseTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

// Helper function to format minutes back to time string
function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// Generate date array from range
function generateDateRange(from: string, to: string): string[] {
  const dates: string[] = [];
  const startDate = new Date(`${from}T00:00:00.000Z`);
  const endDate = new Date(`${to}T00:00:00.000Z`);

  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return dates;
}

// Get base slots for a specific date
function getBaseSlotsForDate(date: string, config: $FixMe) {
  // Check for specific date override
  const specificDate = config.availability.specificDates?.find((sd: $FixMe) => sd.date === date);

  if (specificDate) {
    return specificDate.enabled ? specificDate.slots : [];
  }

  // Fall back to weekly schedule
  const dayName = getDayName(date);
  const weeklyDay = config.availability.schedule[dayName];

  return weeklyDay?.enabled ? weeklyDay.slots : [];
}

// Generate available time slots
function generateTimeSlots(baseSlots: $FixMe[], duration: number, bufferTime: number): string[] {
  const availableSlots: string[] = [];

  baseSlots.forEach((slot) => {
    const startTime = parseTime(slot.start);
    const endTime = parseTime(slot.end);
    const slotDuration = duration + bufferTime;

    let currentTime = startTime;
    while (currentTime + duration <= endTime) {
      availableSlots.push(formatTime(currentTime));
      currentTime += slotDuration;
    }
  });

  return availableSlots;
}

// Process slots for a single date
async function processDateSlots(date: string, allAppointments: $FixMe[], slotsConfig: $FixMe) {
  const baseSlots = getBaseSlotsForDate(date, slotsConfig);

  if (baseSlots.length === 0) {
    return {
      date,
      availableSlots: [],
      totalSlots: 0,
      bookedSlots: 0,
      remainingSlots: 0,
      dailyLimitReached: false,
      message: 'No slots available for this date',
    };
  }

  const allPossibleSlots = generateTimeSlots(
    baseSlots,
    slotsConfig.duration,
    slotsConfig.bufferTime
  );

  // Filter appointments for the current date correctly
  // Handle both Date objects and string dates
  const dateAppointments = allAppointments.filter((app) => {
    const appointmentDate =
      app.date instanceof Date ? app.date.toISOString().split('T')[0] : app.date;
    return appointmentDate === date;
  });

  const bookedSlotTimes = dateAppointments.map((appointment) => appointment.startTime);
  const dailyLimitReached = dateAppointments.length >= (slotsConfig.maxBookingsPerDay || Infinity);

  const availableSlots = dailyLimitReached
    ? []
    : allPossibleSlots.filter((slot) => !bookedSlotTimes.includes(slot));

  return {
    date,
    availableSlots,
    totalSlots: allPossibleSlots.length,
    bookedSlots: dateAppointments.length,
    remainingSlots: availableSlots.length,
    dailyLimitReached,
    maxBookingsPerDay: slotsConfig.maxBookingsPerDay,
  };
}

export const POST = auth(async (request: NextAuthRequest, context: $FixMe) => {
  try {
    await connectDB();

    const { uid } = await context.params;
    const data = await request.json();
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    let { dates, from, to } = data;

    // Validation and Date Generation
    if (!dates && (!from || !to)) {
      return NextResponse.json(
        { message: 'Please provide either dates array or from/to date range' },
        { status: 400 }
      );
    }

    // Handle date range scenario
    if (from && to) {
      if (!dateRegex.test(from) || !dateRegex.test(to)) {
        return NextResponse.json(
          { message: 'Invalid date format. Use YYYY-MM-DD' },
          { status: 400 }
        );
      }
      if (new Date(from) >= new Date(to)) {
        return NextResponse.json({ message: 'From date must be before to date' }, { status: 400 });
      }

      // Generate dates array from range
      dates = generateDateRange(from, to);
    }
    // Handle specific dates scenario
    else if (dates) {
      if (!Array.isArray(dates)) {
        return NextResponse.json({ message: 'Dates must be an array' }, { status: 400 });
      }
      for (const date of dates) {
        if (!dateRegex.test(date)) {
          return NextResponse.json(
            { message: `Invalid date format: ${date}. Use YYYY-MM-DD` },
            { status: 400 }
          );
        }
      }
    }

    // Get slots configuration
    const slotsConfig = await Slot.findOne({ uid: Number(uid) });
    if (!slotsConfig) {
      return NextResponse.json({ message: 'Slots configuration not found' }, { status: 404 });
    }

    // Build the date query based on the scenario
    let dateQuery;
    if (from && to) {
      // For date range, query between the dates
      dateQuery = {
        $gte: new Date(`${from}T00:00:00.000Z`),
        $lte: new Date(`${to}T23:59:59.999Z`),
      };
    } else {
      // For specific dates, use $in operator
      dateQuery = { $in: dates.map((date: string) => new Date(`${date}T00:00:00.000Z`)) };
    }

    // Get appointments for the date range/dates
    const appointments = await Appointment.find({
      doctor: Number(uid),
      date: dateQuery,
    });

    console.log(appointments);

    // Process each date individually
    const dateSlots = await Promise.all(
      dates.map((date: string) => processDateSlots(date, appointments, slotsConfig))
    );

    // Calculate total dates properly
    const totalDates = dates.length;

    // Calculate overall statistics
    const overallStats = {
      totalDates,
      totalAvailableSlots: dateSlots.reduce((sum, day) => sum + day.availableSlots.length, 0),
      totalPossibleSlots: dateSlots.reduce((sum, day) => sum + day.totalSlots, 0),
      totalBookedSlots: dateSlots.reduce((sum, day) => sum + day.bookedSlots, 0),
      datesWithAvailability: dateSlots.filter((day) => day.availableSlots.length > 0).length,
      datesWithNoAvailability: dateSlots.filter((day) => day.availableSlots.length === 0).length,
    };

    const response = {
      success: true,
      requestType: from && to ? 'dateRange' : 'specificDates',
      dateRange: from && to ? { from, to } : null,
      overallStats,
      dateSlots,
      config: {
        duration: slotsConfig.duration,
        bufferTime: slotsConfig.bufferTime,
        maxBookingsPerDay: slotsConfig.maxBookingsPerDay,
        timezone: slotsConfig.timezone,
      },
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error('Error getting slot availability:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});

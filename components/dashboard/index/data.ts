import { $FixMe } from '@/types';
import { ButtonProps } from '@heroui/react';

export type ChartData = {
  weekday: string;
  [key: string]: string | number;
};

export type BarChartProps = {
  title: string;
  value: string;
  unit?: string;
  color: ButtonProps['color'];
  categories: string[];
  chartData: ChartData[];
};

export type CircleChartProps = {
  title: string;
  total: number;
  unit?: string;
  color: ButtonProps['color'];
  categories: string[];
  chartData: { name: string; value: number }[];
};

export type KpiSummaryProps = {
  metricName: string;
  icon: string;
  value: number;
  changeValue: number;
  changeUnit: string;
  trend: 'up' | 'down';
  changeDescription: string;
};

export type DummyDataProps = {
  dashboardData: {
    kpiSummary: KpiSummaryProps[];
    appointmentsByType: BarChartProps;
    patientByAgeGroup: CircleChartProps;
    financialTrend: $FixMe;
    patientLoadByDepartment: $FixMe;
    dailyStaffAvailability: $FixMe;
    operationalTaskLog: $FixMe;
    upcomingAppointments: $FixMe;
    systemEventFeed: $FixMe;
  };
};

export const dummyData: DummyDataProps = {
  dashboardData: {
    kpiSummary: [
      {
        metricName: 'Total Invoice',
        icon: 'solar:wad-of-money-line-duotone',
        value: 1287,
        changeValue: 3.14,
        changeUnit: '%',
        trend: 'up',
        changeDescription: '56 more than yesterday',
      },
      {
        metricName: 'Total Patients',
        icon: 'solar:user-circle-line-duotone',
        value: 965,
        changeValue: 2.76,
        changeUnit: '%',
        trend: 'up',
        changeDescription: '45 more than yesterday',
      },
      {
        metricName: 'Appointments',
        icon: 'solar:calendar-line-duotone',
        value: 315,
        changeValue: -1.5,
        changeUnit: '%',
        trend: 'down',
        changeDescription: '18 less than yesterday',
      },
      {
        metricName: 'Bedrooms',
        icon: 'solar:bed-line-duotone',
        value: 128,
        changeValue: 1.64,
        changeUnit: '%',
        trend: 'up',
        changeDescription: '32 more than yesterday',
      },
    ],
    appointmentsByType: {
      title: 'Appointments by Type',
      value: '128',
      unit: 'appointments',
      categories: ['Consultation', 'Follow-up', 'Emergency'],
      color: 'primary',
      chartData: [
        {
          weekday: 'Mon',
          Consultation: 120,
          'Follow-up': 280,
          Emergency: 180,
        },
        {
          weekday: 'Tue',
          Consultation: 150,
          'Follow-up': 320,
          Emergency: 220,
        },
        {
          weekday: 'Wed',
          Consultation: 180,
          'Follow-up': 250,
          Emergency: 150,
        },
        {
          weekday: 'Thu',
          Consultation: 140,
          'Follow-up': 290,
          Emergency: 180,
        },
        {
          weekday: 'Fri',
          Consultation: 160,
          'Follow-up': 270,
          Emergency: 190,
        },
        {
          weekday: 'Sat',
          Consultation: 130,
          'Follow-up': 240,
          Emergency: 210,
        },
        {
          weekday: 'Sun',
          Consultation: 170,
          'Follow-up': 300,
          Emergency: 240,
        },
      ],
    },
    patientByAgeGroup: {
      title: 'Patient by Age Group',
      total: 1200,
      unit: 'patients',
      categories: ['0-18', '19-36', '37-54', '55+'],
      color: 'default',
      chartData: [
        { name: '0-18', value: 400 },
        { name: '19-36', value: 300 },
        { name: '37-54', value: 300 },
        { name: '55+', value: 200 },
      ],
    },

    financialTrend: {
      metric: 'Revenue',
      currentValue: 1495, // (Implied)
      timeframe: 'Month',
      series: [
        { day: 'Mon', value: 1000 },
        { day: 'Tue', value: 1500 },
        { day: 'Wed', value: 800 },
        // ... more days
      ],
    },
    patientLoadByDepartment: {
      totalPatients: 1890,
      breakdown: [
        { department: 'Emergency Medicine', percentage: '52%' },
        { department: 'General Medicine', percentage: '28%' },
        { department: 'Internal Medicine', percentage: '20%' },
        { department: 'Other Departments', percentage: '17%' },
      ],
    },
    dailyStaffAvailability: [
      {
        doctor: 'Dr. Petra Winsburry',
        specialty: 'General Medicine',
        time: '09:00 AM',
        status: 'Available',
      },
      {
        doctor: 'Dr. Annema Karlin',
        specialty: 'Orthopedics',
        time: '10:00 AM',
        status: 'Unavailable',
      },
      {
        doctor: 'Dr. Olivia Martinez',
        specialty: 'Dermatology',
        time: '10:00 AM',
        status: 'Available',
      },
      // ... more doctors
    ],
    operationalTaskLog: [
      { task: 'Room Cleaning Needed', timeAgo: '1 minutes ago', status: 'pending' },
      { task: 'Equipment Maintenance', timeAgo: '1 hour ago', status: 'pending' },
      { task: 'Medication Restock', timeAgo: 'Yesterday', status: 'pending' },
      // ... more reports
    ],
    upcomingAppointments: [
      {
        patientName: 'Caren G. Simpson',
        date: '20-07-28',
        time: '09:00 AM',
        doctor: 'Dr. Petra Winsburry',
        service: 'Routine Check-up',
        status: 'Confirmed',
      },
      {
        patientName: 'Edgar Varrow',
        date: '20-07-28',
        time: '10:30 AM',
        doctor: 'Dr. Olivia Martinez',
        service: 'Cardiac Consultation',
        status: 'Confirmed',
      },
      {
        patientName: 'Ocean Jane Lupre',
        date: '20-07-28',
        time: '11:00 AM',
        doctor: 'Dr. Damian Sanchez',
        service: 'Pediatric Check-Up',
        status: 'Pending',
      },
      // ... more appointments
    ],
    systemEventFeed: [
      {
        event: 'Fela Müller discharged from Room 209 after successful treatment',
        timeAgo: '5 min ago',
      },
      {
        event: 'Léo Rousseau admitted to Room 312 for surgery scheduled later today',
        timeAgo: '12 min ago',
      },
      // ... more activities
    ],
  },
};

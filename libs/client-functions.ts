'use client';

import { addToast } from '@heroui/react';
import { saveAs } from 'file-saver';

import { EventType } from './interface';

export const handleAddToCalendar = (event: EventType) => {
  const { title, description, location, start, end } = event;

  const startDate = new Date(start).toISOString().replace(/[-:]/g, '').split('.')[0]; // Format: YYYYMMDDTHHmmss
  const endDate = new Date(end).toISOString().replace(/[-:]/g, '').split('.')[0]; // Format: YYYYMMDDTHHmmss

  const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your App Name//NONSGML v1.0//EN
BEGIN:VEVENT
UID:${Date.now()}@yourapp.com
DTSTAMP:${startDate}Z
DTSTART:${startDate}Z
DTEND:${endDate}Z
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
STATUS:${event.busy ? 'BUSY' : 'FREE'}
END:VEVENT
END:VCALENDAR
`.trim();

  const blob = new Blob([icsContent], {
    type: 'text/calendar;charset=utf-8',
  });

  saveAs(blob, `${title}.ics`);
  addToast({
    title: 'Downloaded .ics file',
    color: 'success',
  });
};

export const addToGoogleCalendar = (event: EventType) => {
  const { title, description, location, start, end } = event;

  const startDate = `${start.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;
  const endDate = `${end.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;

  const googleCalendarUrl = new URL('https://calendar.google.com/calendar/render');
  googleCalendarUrl.searchParams.append('action', 'TEMPLATE');
  googleCalendarUrl.searchParams.append('text', title);
  googleCalendarUrl.searchParams.append('details', description);
  googleCalendarUrl.searchParams.append('location', location);
  googleCalendarUrl.searchParams.append('dates', `${startDate}/${endDate}`);

  // Open Google Calendar link in a new tab
  window.open(googleCalendarUrl.toString(), '_blank');
};

export const addToOutlookCalendar = (event: EventType) => {
  const { title, description, location, start, end } = event;

  const startDate = start.toISOString();
  const endDate = end.toISOString();

  const outlookCalendarUrl = new URL('https://outlook.live.com/calendar/0/deeplink/compose');
  outlookCalendarUrl.searchParams.append('path', '/calendar/action/compose');
  outlookCalendarUrl.searchParams.append('subject', title);
  outlookCalendarUrl.searchParams.append('body', description);
  outlookCalendarUrl.searchParams.append('location', location);
  outlookCalendarUrl.searchParams.append('startdt', startDate);
  outlookCalendarUrl.searchParams.append('enddt', endDate);

  // Open Outlook Calendar link in a new tab
  window.open(outlookCalendarUrl.toString(), '_blank');
};

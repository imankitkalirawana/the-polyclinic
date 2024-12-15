'use client';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

function AddToCalendar({ event }: { event: { title: string; date: string } }) {
  const handleAddToCalendar = () => {
    const { title, date } = event;
    const startDate = new Date(date)
      .toISOString()
      .replace(/[-:]/g, '')
      .split('.')[0]; // Format: YYYYMMDDTHHmmss
    const endDate = new Date(new Date(date).getTime() + 60 * 60 * 1000)
      .toISOString()
      .replace(/[-:]/g, '')
      .split('.')[0]; // Add 1 hour to the event for demo purposes

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
DESCRIPTION:Event created from Your App.
END:VEVENT
END:VCALENDAR
`.trim();

    const blob = new Blob([icsContent], {
      type: 'text/calendar;charset=utf-8'
    });
    saveAs(blob, `${title}.ics`);
  };

  return (
    <button
      onClick={() => {
        toast('Event added to calendar');
      }}
      className="rounded bg-blue-500 p-2 text-white hover:bg-blue-700"
    >
      Add to Calendar
    </button>
  );
}

export default function Home() {
  const event = {
    title: 'My Next.js Event',
    date: '2024-12-25T10:00:00'
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-xl font-bold">Event: {event.title}</h1>
      <p>Date: {new Date(event.date).toLocaleString()}</p>
      <AddToCalendar event={event} />
    </div>
  );
}

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');
  const date = searchParams.get('date');

  if (!title || !date) {
    return NextResponse.json(
      { error: 'Missing title or date in query parameters' },
      { status: 400 }
    );
  }

  const startDate = new Date(date).toISOString().replace(/[-:]/g, '').split('.')[0];
  const endDate = new Date(new Date(date).getTime() + 60 * 60 * 1000)
    .toISOString()
    .replace(/[-:]/g, '')
    .split('.')[0];

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

  const response = new NextResponse(icsContent, {
    headers: {
      'Content-Type': 'text/calendar',
      'Content-Disposition': `attachment; filename="${title}.ics"`,
    },
  });

  return response;
}

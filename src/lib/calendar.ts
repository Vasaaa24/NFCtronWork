// Everything for the "add to calendar" bonus.

import type { EventDetail } from '@/api/types';

// Calendars want the compact UTC form, e.g. 20250601T120000Z.
function toCalendarStamp(iso: string): string {
	return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

// Google Calendar "add event" link.
export function buildGoogleCalendarUrl(event: EventDetail): string {
	const params = new URLSearchParams({
		action: 'TEMPLATE',
		text: event.namePub,
		dates: `${toCalendarStamp(event.dateFrom)}/${toCalendarStamp(event.dateTo)}`,
		details: event.description,
		location: event.place,
	});
	return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// Builds an .ics file (Apple Calendar / Outlook) and returns a download URL.
// The caller should revoke the URL once the download started.
export function buildIcsDownloadUrl(event: EventDetail): string {
	const lines = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//NFCtron//Seating Case Study//EN',
		'BEGIN:VEVENT',
		`UID:${event.eventId}`,
		`DTSTAMP:${toCalendarStamp(new Date().toISOString())}`,
		`DTSTART:${toCalendarStamp(event.dateFrom)}`,
		`DTEND:${toCalendarStamp(event.dateTo)}`,
		`SUMMARY:${escapeIcs(event.namePub)}`,
		`DESCRIPTION:${escapeIcs(event.description)}`,
		`LOCATION:${escapeIcs(event.place)}`,
		'END:VEVENT',
		'END:VCALENDAR',
	];
	const blob = new Blob([lines.join('\r\n')], {
		type: 'text/calendar;charset=utf-8',
	});
	return URL.createObjectURL(blob);
}

// Escape the characters that have special meaning in .ics.
function escapeIcs(value: string): string {
	return value
		.replace(/\\/g, '\\\\')
		.replace(/;/g, '\\;')
		.replace(/,/g, '\\,')
		.replace(/\n/g, '\\n');
}

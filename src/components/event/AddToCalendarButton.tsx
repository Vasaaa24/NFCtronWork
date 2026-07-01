import { CalendarPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { EventDetail } from '@/api/types';
import { buildGoogleCalendarUrl, buildIcsDownloadUrl } from '@/lib/calendar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Dropdown with Google Calendar link + .ics download.
export function AddToCalendarButton({ event }: { event: EventDetail }) {
	const { t } = useTranslation();

	function downloadIcs() {
		const url = buildIcsDownloadUrl(event);
		const link = document.createElement('a');
		link.href = url;
		link.download = `${event.namePub}.ics`;
		link.click();
		// free the blob url once the download kicked off
		setTimeout(() => URL.revokeObjectURL(url), 0);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="secondary" className="w-full gap-2">
					<CalendarPlus className="size-4" />
					{t('event.addToCalendar')}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-56">
				<DropdownMenuItem asChild>
					<a
						href={buildGoogleCalendarUrl(event)}
						target="_blank"
						rel="noreferrer"
					>
						Google Calendar
					</a>
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={downloadIcs}>
					Apple / Outlook (.ics)
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

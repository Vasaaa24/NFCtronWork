import { CalendarDays, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { EventDetail } from '@/api/types';
import { formatDateRange } from '@/lib/format';
import { AddToCalendarButton } from './AddToCalendarButton';

// The API sometimes prefixes the event name with an emoji - drop it for a
// cleaner heading.
function cleanName(name: string): string {
	return name.replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '').trim();
}

// Right-hand card with the event info: image, name, date, place, description.
export function EventInfo({ event }: { event: EventDetail }) {
	const { i18n } = useTranslation();

	return (
		<aside className="w-full lg:max-w-sm bg-white rounded-2xl shadow-sm ring-1 ring-zinc-200/60 p-4 flex flex-col gap-4 self-start lg:sticky lg:top-[92px]">
			<img
				src={event.headerImageUrl}
				alt={cleanName(event.namePub)}
				loading="lazy"
				className="rounded-xl h-44 w-full object-cover bg-zinc-100"
			/>

			<h1 className="text-2xl text-zinc-900 font-bold leading-tight">
				{cleanName(event.namePub)}
			</h1>

			<dl className="flex flex-col gap-2.5 text-sm text-zinc-600">
				<div className="flex items-start gap-2.5">
					<span className="grid size-8 shrink-0 place-items-center rounded-lg bg-zinc-100 text-zinc-500">
						<CalendarDays className="size-4" />
					</span>
					<dd className="pt-1.5">
						{formatDateRange(event.dateFrom, event.dateTo, i18n.language)}
					</dd>
				</div>
				<div className="flex items-start gap-2.5">
					<span className="grid size-8 shrink-0 place-items-center rounded-lg bg-zinc-100 text-zinc-500">
						<MapPin className="size-4" />
					</span>
					<dd className="pt-1.5">{event.place}</dd>
				</div>
			</dl>

			<p className="text-sm text-zinc-500 leading-relaxed">{event.description}</p>

			<div className="mt-auto pt-1">
				<AddToCalendarButton event={event} />
			</div>
		</aside>
	);
}

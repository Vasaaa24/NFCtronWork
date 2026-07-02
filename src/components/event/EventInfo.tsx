import { useState } from 'react';
import { CalendarDays, ChevronDown, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { EventDetail } from '@/api/types';
import { cn } from '@/lib/utils';
import { formatDateRange } from '@/lib/format';
import { AddToCalendarButton } from './AddToCalendarButton';

// The API sometimes prefixes the event name with an emoji - drop it for a
// cleaner heading.
function cleanName(name: string): string {
	return name.replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '').trim();
}

// Right-hand card with the event info: image, name, date, place, description.
export function EventInfo({ event }: { event: EventDetail }) {
	const { t, i18n } = useTranslation();
	// long descriptions start clamped, expandable on demand
	const [expanded, setExpanded] = useState(false);

	return (
		<aside className="w-full lg:max-w-sm bg-white rounded-2xl shadow-soft ring-1 ring-zinc-200/60 p-4 flex flex-col gap-4 self-start lg:sticky lg:top-[84px] animate-in fade-in slide-in-from-bottom-2 duration-500">
			<img
				src={event.headerImageUrl}
				alt={cleanName(event.namePub)}
				loading="lazy"
				className="rounded-xl h-44 w-full object-cover bg-zinc-100 ring-1 ring-zinc-900/5"
			/>

			<h1 className="text-2xl text-zinc-900 font-bold leading-tight tracking-tight">
				{cleanName(event.namePub)}
			</h1>

			<dl className="flex flex-col gap-2.5 text-sm text-zinc-600">
				<div className="flex items-start gap-3">
					<span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
						<CalendarDays className="size-4" />
					</span>
					<dd className="pt-1.5">
						{formatDateRange(event.dateFrom, event.dateTo, i18n.language)}
					</dd>
				</div>
				<div className="flex items-start gap-3">
					<span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
						<MapPin className="size-4" />
					</span>
					<dd className="pt-1.5">{event.place}</dd>
				</div>
			</dl>

			<div className="h-px bg-zinc-100" />

			<div className="flex flex-col gap-1.5">
				<p
					className={cn(
						'text-sm text-zinc-500 leading-relaxed',
						!expanded && 'line-clamp-4',
					)}
				>
					{event.description}
				</p>
				<button
					type="button"
					onClick={() => setExpanded((v) => !v)}
					aria-expanded={expanded}
					className="self-start inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
				>
					{expanded ? t('event.showLess') : t('event.showMore')}
					<ChevronDown
						className={cn(
							'size-4 transition-transform duration-200',
							expanded && 'rotate-180',
						)}
					/>
				</button>
			</div>

			<div className="mt-auto pt-1">
				<AddToCalendarButton event={event} />
			</div>
		</aside>
	);
}

// Loading placeholder that mirrors the panel's layout.
export function EventInfoSkeleton() {
	return (
		<aside className="w-full lg:max-w-sm bg-white rounded-2xl shadow-soft ring-1 ring-zinc-200/60 p-4 flex flex-col gap-4 self-start">
			<div className="h-44 w-full animate-pulse rounded-xl bg-zinc-200/70" />
			<div className="h-7 w-3/4 animate-pulse rounded bg-zinc-200/70" />
			<div className="space-y-2">
				<div className="h-8 w-full animate-pulse rounded bg-zinc-200/50" />
				<div className="h-8 w-5/6 animate-pulse rounded bg-zinc-200/50" />
			</div>
			<div className="h-px bg-zinc-100" />
			<div className="space-y-1.5">
				<div className="h-3 w-full animate-pulse rounded bg-zinc-200/50" />
				<div className="h-3 w-full animate-pulse rounded bg-zinc-200/50" />
				<div className="h-3 w-2/3 animate-pulse rounded bg-zinc-200/50" />
			</div>
			<div className="mt-auto h-10 w-full animate-pulse rounded-md bg-zinc-200/60" />
		</aside>
	);
}

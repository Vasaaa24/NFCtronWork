import { useMemo } from 'react';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useEventTickets } from '@/hooks/useEvent';
import { buildRowLayouts } from '@/lib/seating';
import { formatCurrency } from '@/lib/format';
import { Seat, type SeatAccent } from '@/components/Seat';

// One colour per ticket type. The class names have to be written out in full,
// otherwise Tailwind would purge them (it only keeps classes it sees literally).
const ACCENTS: SeatAccent[] = [
	{
		base: 'bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200 hover:bg-violet-100 hover:ring-violet-300',
		dot: 'bg-violet-500',
	},
	{
		base: 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200 hover:bg-sky-100 hover:ring-sky-300',
		dot: 'bg-sky-500',
	},
	{
		base: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200 hover:bg-amber-100 hover:ring-amber-300',
		dot: 'bg-amber-500',
	},
	{
		base: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 hover:bg-emerald-100 hover:ring-emerald-300',
		dot: 'bg-emerald-500',
	},
];
const FALLBACK_ACCENT: SeatAccent = {
	base: 'bg-zinc-50 text-zinc-600 ring-1 ring-inset ring-zinc-200 hover:bg-zinc-100 hover:ring-zinc-300',
	dot: 'bg-zinc-400',
};

interface SeatingMapProps {
	eventId: string;
	currencyIso: string;
}

export function SeatingMap({ eventId, currencyIso }: SeatingMapProps) {
	const { t, i18n } = useTranslation();
	const { data, isPending, isError } = useEventTickets(eventId);

	const rows = useMemo(() => (data ? buildRowLayouts(data) : []), [data]);

	// map ticket type id -> colour
	const accentByTypeId = useMemo(() => {
		const map = new Map<string, SeatAccent>();
		data?.ticketTypes.forEach((type, index) => {
			map.set(type.id, ACCENTS[index % ACCENTS.length]);
		});
		return map;
	}, [data]);

	const seatCount = useMemo(
		() => rows.reduce((sum, row) => sum + row.slots.filter((s) => s.seat).length, 0),
		[rows],
	);

	if (isPending) return <SeatMapSkeleton />;

	if (isError || !data) {
		return (
			<div className="grow flex flex-col items-center justify-center gap-2 p-8 text-center">
				<AlertCircle className="size-8 text-red-400" />
				<p className="text-sm text-red-500">{t('seating.error')}</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-5 h-full">
			<div className="flex items-start justify-between gap-4 flex-wrap border-b border-zinc-100 pb-4">
				<div>
					<h2 className="text-lg font-semibold text-zinc-900 tracking-tight">
						{t('seating.title')}
					</h2>
					<p className="text-sm text-zinc-500">
						{t('seating.available', { count: seatCount })}
					</p>
				</div>
				{/* Legend */}
				<ul className="flex flex-wrap gap-2 text-xs font-medium text-zinc-600">
					{data.ticketTypes.map((type) => (
						<li
							key={type.id}
							className="flex items-center gap-1.5 rounded-full bg-zinc-50 px-2.5 py-1.5 ring-1 ring-zinc-200/70"
						>
							<span
								className={`size-2.5 rounded-[3px] ${
									(accentByTypeId.get(type.id) ?? FALLBACK_ACCENT).dot
								}`}
							/>
							{type.name}
							<span className="text-zinc-400 tabular-nums">
								{formatCurrency(type.price, currencyIso, i18n.language)}
							</span>
						</li>
					))}
				</ul>
			</div>

			{/* Map is centered in whatever vertical space is left in the card. */}
			<div className="flex-1 flex flex-col items-center justify-center gap-5 sm:gap-8 py-1 sm:py-2 animate-in fade-in duration-500">
				{/* Stage - the dark anchor the whole map orients around */}
				<div className="w-full max-w-xl rounded-t-[28px] rounded-b-lg bg-zinc-900 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.45em] text-zinc-400 shadow-soft">
					{t('seating.stage')}
				</div>

				<div className="max-w-full overflow-x-auto scrollbar-thin pb-2">
					<div className="flex w-fit flex-col gap-1.5 sm:gap-2 lg:gap-2.5 mx-auto">
						{rows.map((row) => (
							<div
								key={row.seatRow}
								className="flex items-center gap-2 sm:gap-3 lg:gap-4"
							>
								<span className="w-4 lg:w-6 shrink-0 text-right text-[11px] lg:text-xs font-medium text-zinc-300 tabular-nums">
									{row.seatRow}
								</span>
								<div className="flex gap-1 sm:gap-1.5 lg:gap-2">
									{row.slots.map((slot) =>
										slot.seat ? (
											<Seat
												key={slot.seat.seatId}
												seat={slot.seat}
												seatRow={row.seatRow}
												currencyIso={currencyIso}
												accent={
													accentByTypeId.get(slot.seat.ticketTypeId) ??
													FALLBACK_ACCENT
												}
											/>
										) : (
											// empty spot, keeps the numbering lined up across gaps
											<div
												key={`gap-${row.seatRow}-${slot.place}`}
												className="size-7 sm:size-9 lg:size-10"
												aria-hidden
											/>
										),
									)}
								</div>
								<span className="hidden sm:block w-4 lg:w-6 shrink-0 text-left text-[11px] lg:text-xs font-medium text-zinc-300 tabular-nums">
									{row.seatRow}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

// Placeholder shown while the seating layout loads.
function SeatMapSkeleton() {
	const { t } = useTranslation();
	return (
		<div className="flex flex-col gap-5 h-full">
			<div className="flex items-start justify-between gap-4 flex-wrap">
				<div className="space-y-2">
					<div className="h-5 w-40 animate-pulse rounded bg-zinc-200/70" />
					<div className="h-4 w-56 animate-pulse rounded bg-zinc-200/60" />
				</div>
				<div className="flex gap-2">
					<div className="h-6 w-28 animate-pulse rounded-full bg-zinc-200/60" />
					<div className="h-6 w-28 animate-pulse rounded-full bg-zinc-200/60" />
				</div>
			</div>
			<div className="flex-1 flex flex-col items-center justify-center gap-6 py-2">
				<div className="h-8 w-full max-w-lg animate-pulse rounded-2xl bg-zinc-200/60" />
				<div className="flex flex-col gap-2">
					{Array.from({ length: 6 }).map((_, r) => (
						<div key={r} className="flex gap-2">
							{Array.from({ length: 12 }).map((_, c) => (
								<div
									key={c}
									className="size-7 sm:size-9 lg:size-10 animate-pulse rounded-lg bg-zinc-200/70"
									style={{ animationDelay: `${(r + c) * 30}ms` }}
								/>
							))}
						</div>
					))}
				</div>
			</div>
			<span className="sr-only">{t('seating.loading')}</span>
		</div>
	);
}

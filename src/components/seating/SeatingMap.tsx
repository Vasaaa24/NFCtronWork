import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useEventTickets } from '@/hooks/useEvent';
import { buildRowLayouts } from '@/lib/seating';
import { formatCurrency } from '@/lib/format';
import { Seat, type SeatAccent } from '@/components/Seat';

// One colour per ticket type. The class names have to be written out in full,
// otherwise Tailwind would purge them (it only keeps classes it sees literally).
const ACCENTS: SeatAccent[] = [
	{ base: 'bg-violet-100 text-violet-700 hover:bg-violet-200', dot: 'bg-violet-500' },
	{ base: 'bg-sky-100 text-sky-700 hover:bg-sky-200', dot: 'bg-sky-500' },
	{ base: 'bg-amber-100 text-amber-700 hover:bg-amber-200', dot: 'bg-amber-500' },
	{ base: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200', dot: 'bg-emerald-500' },
];
const FALLBACK_ACCENT: SeatAccent = {
	base: 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200',
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

	if (isPending) {
		return (
			<div className="grow grid place-items-center p-8 text-sm text-zinc-500">
				{t('seating.loading')}
			</div>
		);
	}

	if (isError || !data) {
		return (
			<div className="grow grid place-items-center p-8 text-sm text-red-500">
				{t('seating.error')}
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-5 h-full">
			<div className="flex items-start justify-between gap-4 flex-wrap">
				<div>
					<h2 className="text-lg font-semibold text-zinc-900">
						{t('seating.title')}
					</h2>
					<p className="text-sm text-zinc-500">{t('seating.subtitle')}</p>
				</div>
				{/* Legend */}
				<ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-medium text-zinc-600">
					{data.ticketTypes.map((type) => (
						<li
							key={type.id}
							className="flex items-center gap-1.5 rounded-full bg-zinc-50 px-2.5 py-1 ring-1 ring-zinc-200/70"
						>
							<span
								className={`size-2.5 rounded-[3px] ${
									(accentByTypeId.get(type.id) ?? FALLBACK_ACCENT).dot
								}`}
							/>
							{type.name}
							<span className="text-zinc-400">
								{formatCurrency(type.price, currencyIso, i18n.language)}
							</span>
						</li>
					))}
				</ul>
			</div>

			{/* Map is centered in whatever vertical space is left in the card. */}
			<div className="flex-1 flex flex-col items-center justify-center gap-4 sm:gap-6 py-1 sm:py-2">
				{/* Stage */}
				<div className="w-full max-w-lg rounded-lg bg-zinc-100 py-2 text-center text-[11px] font-medium uppercase tracking-[0.35em] text-zinc-500 ring-1 ring-inset ring-zinc-200">
					{t('seating.stage')}
				</div>

				<div className="max-w-full overflow-x-auto pb-1">
					<div className="flex w-fit flex-col gap-1.5 sm:gap-2 lg:gap-2.5 mx-auto">
						{rows.map((row) => (
							<div
								key={row.seatRow}
								className="flex items-center gap-2 sm:gap-3 lg:gap-4"
							>
								<span className="w-4 lg:w-6 shrink-0 text-right text-[11px] lg:text-xs font-medium text-zinc-300">
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
								<span className="hidden sm:block w-4 lg:w-6 shrink-0 text-left text-[11px] lg:text-xs font-medium text-zinc-300">
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

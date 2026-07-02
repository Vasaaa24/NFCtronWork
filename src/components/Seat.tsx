import { Check, Minus, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/format';
import { useCart } from '@/store/use-cart';
import type { SeatWithType } from '@/lib/seating';

// Tailwind classes used to colour a seat by its ticket type.
export interface SeatAccent {
	base: string; // the seat button itself
	dot: string; // little colour dot in the popover
}

interface SeatProps {
	seat: SeatWithType;
	seatRow: number;
	currencyIso: string;
	accent: SeatAccent;
}

// One seat. Clicking it opens a popover with the details and an add/remove
// button. Whether it's selected comes from the cart context.
export function Seat({ seat, seatRow, currencyIso, accent }: SeatProps) {
	const { t, i18n } = useTranslation();
	const { isInCart, toggleSeat } = useCart();
	const selected = isInCart(seat.seatId);
	const price = seat.ticketType?.price ?? 0;

	function handleToggle() {
		toggleSeat({
			seatId: seat.seatId,
			ticketTypeId: seat.ticketTypeId,
			ticketTypeName: seat.ticketType?.name ?? '',
			price,
			seatRow,
			place: seat.place,
		});
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<button
					type="button"
					aria-label={t('seating.seat', { row: seatRow, place: seat.place })}
					aria-pressed={selected}
					className={cn(
						'size-7 sm:size-9 lg:size-10 rounded-lg grid place-items-center text-[11px] sm:text-xs lg:text-sm font-semibold transition-all hover:scale-105 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-1',
						selected
							? 'bg-brand-600 text-white shadow-md ring-2 ring-brand-600 ring-offset-1'
							: accent.base,
					)}
				>
					{selected ? (
						<Check className="size-3.5 lg:size-4 animate-pop" strokeWidth={3} />
					) : (
						seat.place
					)}
				</button>
			</PopoverTrigger>
			<PopoverContent className="w-64 p-0 overflow-hidden">
				<div className="flex items-center justify-between gap-2 border-b border-zinc-100 bg-zinc-50/60 px-4 py-3">
					<div className="flex items-center gap-2">
						<span className={cn('size-3 rounded-[4px]', accent.dot)} />
						<span className="font-semibold text-sm">
							{seat.ticketType?.name ?? t('seat.type')}
						</span>
					</div>
					<span className="text-base font-bold text-zinc-900">
						{formatCurrency(price, currencyIso, i18n.language)}
					</span>
				</div>

				<div className="flex flex-col gap-3 p-4">
					<dl className="grid grid-cols-2 gap-y-1.5 text-sm">
						<dt className="text-zinc-500">{t('seat.row')}</dt>
						<dd className="text-right font-medium tabular-nums">{seatRow}</dd>
						<dt className="text-zinc-500">{t('seat.place')}</dt>
						<dd className="text-right font-medium tabular-nums">{seat.place}</dd>
					</dl>

					{selected ? (
						<Button
							variant="outline"
							size="sm"
							onClick={handleToggle}
							className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
						>
							<Minus className="size-4" />
							{t('seat.remove')}
						</Button>
					) : (
						<Button
							variant="brand"
							size="sm"
							onClick={handleToggle}
							className="gap-1.5"
						>
							<Plus className="size-4" />
							{t('seat.add')}
						</Button>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}

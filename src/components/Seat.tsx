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
						'size-7 sm:size-9 lg:size-10 rounded-lg grid place-items-center text-[11px] sm:text-xs lg:text-sm font-semibold transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-1',
						selected
							? 'bg-zinc-900 text-zinc-50 shadow-md scale-105'
							: accent.base,
					)}
				>
					{seat.place}
				</button>
			</PopoverTrigger>
			<PopoverContent className="w-64">
				<div className="flex flex-col gap-3">
					<div className="flex items-center gap-2">
						<span className={cn('size-3 rounded-[4px]', accent.dot)} />
						<span className="font-medium">
							{seat.ticketType?.name ?? t('seat.type')}
						</span>
					</div>

					<dl className="grid grid-cols-2 gap-1 text-sm">
						<dt className="text-zinc-500">{t('seat.row')}</dt>
						<dd className="text-right">{seatRow}</dd>
						<dt className="text-zinc-500">{t('seat.place')}</dt>
						<dd className="text-right">{seat.place}</dd>
						<dt className="text-zinc-500">{t('seat.price')}</dt>
						<dd className="text-right font-medium">
							{formatCurrency(price, currencyIso, i18n.language)}
						</dd>
					</dl>

					{selected ? (
						<Button variant="destructive" size="sm" onClick={handleToggle}>
							{t('seat.remove')}
						</Button>
					) : (
						<Button variant="default" size="sm" onClick={handleToggle}>
							{t('seat.add')}
						</Button>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}

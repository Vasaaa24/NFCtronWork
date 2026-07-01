import { useTranslation } from 'react-i18next';

import type { CartSeat } from '@/store/cart-context';
import { formatCurrency } from '@/lib/format';

interface OrderSummaryProps {
	items: CartSeat[];
	total: number;
	currencyIso: string;
	locale: string;
}

// Just lists the seats in the cart with the total, shown in the checkout dialog.
export function OrderSummary({ items, total, currencyIso, locale }: OrderSummaryProps) {
	const { t } = useTranslation();

	return (
		<div className="rounded-md border border-zinc-200">
			<p className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
				{t('checkout.summary')}
			</p>
			<ul className="divide-y divide-zinc-100 max-h-40 overflow-y-auto">
				{items.map((item) => (
					<li
						key={item.seatId}
						className="flex items-center justify-between gap-2 px-3 py-2 text-sm"
					>
						<span>
							{t('seating.seat', { row: item.seatRow, place: item.place })}
							<span className="text-zinc-400"> · {item.ticketTypeName}</span>
						</span>
						<span className="font-medium">
							{formatCurrency(item.price, currencyIso, locale)}
						</span>
					</li>
				))}
			</ul>
			<div className="flex items-center justify-between border-t border-zinc-200 px-3 py-2 font-semibold">
				<span>{t('checkout.total')}</span>
				<span>{formatCurrency(total, currencyIso, locale)}</span>
			</div>
		</div>
	);
}

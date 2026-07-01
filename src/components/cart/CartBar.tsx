import { Ticket } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { EventDetail } from '@/api/types';
import { useCart } from '@/store/use-cart';
import { formatCurrency } from '@/lib/format';
import { CheckoutDialog } from './CheckoutDialog';

// Bottom bar with the cart total and the checkout button.
export function CartBar({ event }: { event: EventDetail }) {
	const { t, i18n } = useTranslation();
	const { itemCount, total } = useCart();

	return (
		<nav className="sticky bottom-0 left-0 right-0 z-30 bg-white border-t border-zinc-200 flex justify-center">
			<div className="max-w-screen-lg p-4 sm:p-6 flex justify-between items-center gap-4 grow">
				<div className="flex items-center gap-3">
					<span className="grid size-10 place-items-center rounded-full bg-zinc-100 text-zinc-500">
						<Ticket className="size-5" />
					</span>
					<div className="flex flex-col">
						<span className="text-sm text-zinc-500">
							{itemCount === 0
								? t('cart.empty')
								: t('cart.totalForTickets', { count: itemCount })}
						</span>
						<span className="text-2xl font-semibold text-zinc-900">
							{formatCurrency(total, event.currencyIso, i18n.language)}
						</span>
					</div>
				</div>

				<CheckoutDialog event={event} />
			</div>
		</nav>
	);
}

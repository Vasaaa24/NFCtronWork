import { Ticket, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { EventDetail } from '@/api/types';
import { useCart } from '@/store/use-cart';
import { formatCurrency } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { CheckoutDialog } from './CheckoutDialog';

// Bottom bar with the cart total and the checkout button.
export function CartBar({ event }: { event: EventDetail }) {
	const { t, i18n } = useTranslation();
	const { itemCount, total, clear } = useCart();
	const hasItems = itemCount > 0;

	return (
		<nav className="sticky bottom-0 left-0 right-0 z-30 border-t border-zinc-200/80 bg-white/90 backdrop-blur-md">
			<div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center gap-4">
				<div className="flex items-center gap-3">
					<span className="relative grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
						<Ticket className="size-5" />
						{hasItems && (
							<span
								key={itemCount}
								className="absolute -top-1.5 -right-1.5 grid min-w-5 h-5 px-1 place-items-center rounded-full bg-brand-600 text-[11px] font-bold text-white ring-2 ring-white animate-pop tabular-nums"
							>
								{itemCount}
							</span>
						)}
					</span>
					<div className="flex flex-col leading-tight">
						<span className="text-xs sm:text-sm text-zinc-500">
							{hasItems
								? t('cart.totalForTickets', { count: itemCount })
								: t('cart.empty')}
						</span>
						<span
							key={total}
							className="text-xl sm:text-2xl font-bold text-zinc-900 tabular-nums animate-in fade-in slide-in-from-bottom-1 duration-300"
						>
							{formatCurrency(total, event.currencyIso, i18n.language)}
						</span>
					</div>
				</div>

				<div className="flex items-center gap-1.5 sm:gap-2">
					{hasItems && (
						<Button
							variant="ghost"
							size="icon"
							onClick={clear}
							aria-label={t('cart.clear')}
							title={t('cart.clear')}
							className="text-zinc-400 hover:text-red-600 hover:bg-red-50"
						>
							<Trash2 className="size-4" />
						</Button>
					)}
					<CheckoutDialog event={event} />
				</div>
			</div>
		</nav>
	);
}

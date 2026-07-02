import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useEvent } from '@/hooks/useEvent';
import { Header } from '@/components/layout/Header';
import { EventInfo, EventInfoSkeleton } from '@/components/event/EventInfo';
import { SeatingMap } from '@/components/seating/SeatingMap';
import { CartBar } from '@/components/cart/CartBar';

import './App.css';

function App() {
	const { t } = useTranslation();
	const { data: event, isPending, isError } = useEvent();

	return (
		<div className="flex flex-col grow min-h-screen bg-surface">
			<Header />

			<main className="grow flex flex-col">
				<div className="max-w-screen-xl w-full mx-auto p-4 sm:p-6 pb-28 flex flex-col lg:flex-row items-stretch gap-5">
					{/* Seating card */}
					<section className="bg-white rounded-2xl grow p-3 sm:p-6 shadow-soft ring-1 ring-zinc-200/60 flex flex-col min-h-[340px] sm:min-h-[460px] w-full">
						{isError ? (
							<div className="m-auto flex flex-col items-center gap-2 text-center">
								<AlertCircle className="size-8 text-red-400" />
								<p className="text-sm text-red-500">{t('event.error')}</p>
							</div>
						) : event ? (
							<SeatingMap eventId={event.eventId} currencyIso={event.currencyIso} />
						) : (
							<SeatingCardSkeleton />
						)}
					</section>

					{/* Event info */}
					{isPending && !isError && <EventInfoSkeleton />}
					{event && <EventInfo event={event} />}
				</div>
			</main>

			{/* The cart bar needs the event (currency, id) so it renders once loaded. */}
			{event && <CartBar event={event} />}
		</div>
	);
}

// Shown while the event itself is still loading (before we can fetch seats).
function SeatingCardSkeleton() {
	return (
		<div className="flex flex-col gap-5 h-full">
			<div className="space-y-2">
				<div className="h-5 w-40 animate-pulse rounded bg-zinc-200/70" />
				<div className="h-4 w-56 animate-pulse rounded bg-zinc-200/60" />
			</div>
			<div className="flex-1 flex flex-col items-center justify-center gap-6">
				<div className="h-8 w-full max-w-lg animate-pulse rounded-2xl bg-zinc-200/60" />
				<div className="flex flex-col gap-2">
					{Array.from({ length: 6 }).map((_, r) => (
						<div key={r} className="flex gap-2">
							{Array.from({ length: 12 }).map((_, c) => (
								<div
									key={c}
									className="size-7 sm:size-9 lg:size-10 animate-pulse rounded-lg bg-zinc-200/70"
								/>
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default App;

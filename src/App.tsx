import { useTranslation } from 'react-i18next';

import { useEvent } from '@/hooks/useEvent';
import { Header } from '@/components/layout/Header';
import { EventInfo } from '@/components/event/EventInfo';
import { SeatingMap } from '@/components/seating/SeatingMap';
import { CartBar } from '@/components/cart/CartBar';
import './App.css';

function App() {
	const { t } = useTranslation();
	const { data: event, isPending, isError } = useEvent();

	return (
		<div className="flex flex-col grow min-h-screen bg-zinc-100">
			<Header />

			<main className="grow flex flex-col">
				<div className="max-w-screen-xl w-full mx-auto p-4 sm:p-6 pb-28 flex flex-col lg:flex-row items-stretch gap-5">
					{/* Seating card */}
					<section className="bg-white rounded-2xl grow p-3 sm:p-6 shadow-sm ring-1 ring-zinc-200/60 flex flex-col min-h-[340px] sm:min-h-[420px] w-full">
						{isPending && (
							<p className="m-auto text-sm text-zinc-500">{t('event.loading')}</p>
						)}
						{isError && (
							<p className="m-auto text-sm text-red-500">{t('event.error')}</p>
						)}
						{event && (
							<SeatingMap eventId={event.eventId} currencyIso={event.currencyIso} />
						)}
					</section>

					{/* Event info */}
					{event && <EventInfo event={event} />}
				</div>
			</main>

			{/* The cart bar needs the event (currency, id) so it renders once loaded. */}
			{event && <CartBar event={event} />}
		</div>
	);
}

export default App;

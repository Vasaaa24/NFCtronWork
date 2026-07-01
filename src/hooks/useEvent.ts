import { useQuery } from '@tanstack/react-query';

import { getEvent, getEventTickets } from '@/api/endpoints';

export function useEvent() {
	return useQuery({
		queryKey: ['event'],
		queryFn: ({ signal }) => getEvent(signal),
	});
}

// Tickets + seating for the event. Waits until we actually have the event id.
export function useEventTickets(eventId: string | undefined) {
	return useQuery({
		queryKey: ['event-tickets', eventId],
		queryFn: ({ signal }) => getEventTickets(eventId!, signal),
		enabled: Boolean(eventId),
	});
}

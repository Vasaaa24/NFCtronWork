// Turns the raw API payload into something easy to render. Two things it takes
// care of: it attaches the ticket type to each seat, and it fills gaps in the
// seat numbering with empty slots (the assignment warns that seats don't always
// come in order or one after another).

import type { ApiSeat, EventTickets, TicketType } from '@/api/types';

export interface SeatWithType extends ApiSeat {
	ticketType: TicketType | undefined;
}

// A spot in a row - either a real seat or an empty gap.
export interface SeatSlot {
	place: number;
	seat: SeatWithType | null;
}

export interface RowLayout {
	seatRow: number;
	slots: SeatSlot[];
}

export function buildRowLayouts(tickets: EventTickets): RowLayout[] {
	const ticketTypeById = new Map(
		tickets.ticketTypes.map((type) => [type.id, type]),
	);

	return [...tickets.seatRows]
		.sort((a, b) => a.seatRow - b.seatRow)
		.map((row) => {
			// Look up by place number so we can spot missing seats and keep order.
			const seatByPlace = new Map(row.seats.map((seat) => [seat.place, seat]));
			const maxPlace = row.seats.reduce((max, s) => Math.max(max, s.place), 0);

			const slots: SeatSlot[] = [];
			for (let place = 1; place <= maxPlace; place++) {
				const seat = seatByPlace.get(place);
				slots.push({
					place,
					seat: seat
						? { ...seat, ticketType: ticketTypeById.get(seat.ticketTypeId) }
						: null,
				});
			}
			return { seatRow: row.seatRow, slots };
		});
}

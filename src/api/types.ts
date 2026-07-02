// Types for the API payloads, based on API.md.

/** `GET /event` – public information about the event. */
export interface EventDetail {
	eventId: string;
	namePub: string;
	description: string;
	/** ISO 4217 currency code, e.g. `CZK`. */
	currencyIso: string;
	/** ISO datetime string. */
	dateFrom: string;
	/** ISO datetime string. */
	dateTo: string;
	headerImageUrl: string;
	place: string;
}

/** A purchasable ticket category (price is per seat, in the event currency). */
export interface TicketType {
	id: string;
	name: string;
	price: number;
}

/** A single seat as returned by the API. */
export interface ApiSeat {
	seatId: string;
	/** Seat number within its row. Rows may contain gaps in numbering. */
	place: number;
	ticketTypeId: string;
}

/** A row of seats. */
export interface SeatRow {
	seatRow: number;
	seats: ApiSeat[];
}

/** `GET /event-tickets` – ticket catalogue plus the seating layout. */
export interface EventTickets {
	ticketTypes: TicketType[];
	seatRows: SeatRow[];
}

/** Authenticated user profile. */
export interface User {
	firstName: string;
	lastName: string;
	email: string;
}

/** `POST /login` response. */
export interface LoginResponse {
	message: string;
	user: User;
}

/** `POST /order` request body. */
export interface CreateOrderRequest {
	eventId: string;
	tickets: Array<{
		ticketTypeId: string;
		seatId: string;
	}>;
	user: {
		email: string;
		firstName: string;
		lastName: string;
	};
}

/** `POST /order` response. */
export interface CreateOrderResponse {
	message: string;
	orderId: string;
	tickets: unknown[];
	user: User;
	totalAmount: number;
}

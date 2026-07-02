import { createContext } from 'react';

// A seat that's in the cart. I keep everything I need here (price, row, place,
// ticket type) so I can render the cart and build the order payload without
// having to fetch the seat data again.
export interface CartSeat {
	seatId: string;
	ticketTypeId: string;
	ticketTypeName: string;
	price: number;
	seatRow: number;
	place: number;
}

export interface CartContextValue {
	// sorted by row then place so the order stays stable
	items: CartSeat[];
	itemCount: number;
	// sum of the ticket prices
	total: number;
	isInCart: (seatId: string) => boolean;
	toggleSeat: (seat: CartSeat) => void;
	removeSeat: (seatId: string) => void;
	clear: () => void;
}

export const CartContext = createContext<CartContextValue | null>(null);

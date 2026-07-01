import { useMemo, useReducer, type ReactNode } from 'react';

import {
	CartContext,
	type CartContextValue,
	type CartSeat,
} from './cart-context';

interface CartState {
	// keyed by seatId so adding/removing/looking up a seat is cheap
	seats: Record<string, CartSeat>;
}

type CartAction =
	| { type: 'ADD'; seat: CartSeat }
	| { type: 'REMOVE'; seatId: string }
	| { type: 'TOGGLE'; seat: CartSeat }
	| { type: 'CLEAR' };

function cartReducer(state: CartState, action: CartAction): CartState {
	switch (action.type) {
		case 'ADD':
			return { seats: { ...state.seats, [action.seat.seatId]: action.seat } };
		case 'REMOVE': {
			const next = { ...state.seats };
			delete next[action.seatId];
			return { seats: next };
		}
		case 'TOGGLE': {
			if (state.seats[action.seat.seatId]) {
				const next = { ...state.seats };
				delete next[action.seat.seatId];
				return { seats: next };
			}
			return { seats: { ...state.seats, [action.seat.seatId]: action.seat } };
		}
		case 'CLEAR':
			return { seats: {} };
		default:
			return state;
	}
}

export function CartProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(cartReducer, { seats: {} });

	const value = useMemo<CartContextValue>(() => {
		const items = Object.values(state.seats).sort(
			(a, b) => a.seatRow - b.seatRow || a.place - b.place,
		);
		return {
			items,
			itemCount: items.length,
			total: items.reduce((sum, seat) => sum + seat.price, 0),
			isInCart: (seatId) => Boolean(state.seats[seatId]),
			toggleSeat: (seat) => dispatch({ type: 'TOGGLE', seat }),
			removeSeat: (seatId) => dispatch({ type: 'REMOVE', seatId }),
			clear: () => dispatch({ type: 'CLEAR' }),
		};
	}, [state]);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

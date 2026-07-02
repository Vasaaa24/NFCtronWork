import { useContext } from 'react';

import { CartContext, type CartContextValue } from './cart-context';

// Cart hook - has to be used inside CartProvider.
export function useCart(): CartContextValue {
	const ctx = useContext(CartContext);
	if (!ctx) throw new Error('useCart must be used within a CartProvider');
	return ctx;
}

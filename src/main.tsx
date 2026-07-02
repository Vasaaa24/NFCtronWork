import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import App from './App.tsx';
import { AuthProvider } from '@/store/auth-provider';
import { CartProvider } from '@/store/cart-provider';
import './i18n';
import './index.css';

// One shared query client. Data is fairly static, so retry sparingly and keep
// it cached for the session.
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			staleTime: 5 * 60 * 1000,
			refetchOnWindowFocus: false,
		},
	},
});

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<CartProvider>
					<App />
					<Toaster position="top-center" richColors closeButton />
				</CartProvider>
			</AuthProvider>
		</QueryClientProvider>
	</React.StrictMode>,
);

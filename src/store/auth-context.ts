import { createContext } from 'react';

import type { User } from '@/api/types';

export interface AuthContextValue {
	user: User | null;
	isLoggedIn: boolean;
	// calls the API, throws if the login fails
	login: (email: string, password: string) => Promise<User>;
	logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

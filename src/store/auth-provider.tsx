import { useEffect, useMemo, useState, type ReactNode } from 'react';

import { login as loginRequest } from '@/api/endpoints';
import type { User } from '@/api/types';
import { AuthContext, type AuthContextValue } from './auth-context';

const STORAGE_KEY = 'nfctron.user';

// Try to read the user we saved last time, ignore anything broken.
function readStoredUser(): User | null {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as User) : null;
	} catch {
		return null;
	}
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(readStoredUser);

	// keep the login across page refreshes
	useEffect(() => {
		if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
		else localStorage.removeItem(STORAGE_KEY);
	}, [user]);

	const value = useMemo<AuthContextValue>(
		() => ({
			user,
			isLoggedIn: Boolean(user),
			login: async (email, password) => {
				const { user: authedUser } = await loginRequest(email, password);
				setUser(authedUser);
				return authedUser;
			},
			logout: () => setUser(null),
		}),
		[user],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

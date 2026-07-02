import type { ReactNode } from 'react';

// small red validation message under an input
export function FieldError({ children }: { children: ReactNode }) {
	return (
		<p role="alert" className="text-xs text-red-500">
			{children}
		</p>
	);
}

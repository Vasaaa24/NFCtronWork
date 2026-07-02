// Small fetch wrapper so the endpoint functions don't have to repeat the base
// URL, JSON handling and error checking.

const BASE_URL =
	import.meta.env.VITE_API_BASE_URL ??
	'https://nfctron-frontend-seating-case-study-2024.vercel.app';

// Thrown for any non-2xx response so callers can react to the HTTP status.
export class ApiError extends Error {
	constructor(
		message: string,
		public readonly status: number,
	) {
		super(message);
		this.name = 'ApiError';
	}
}

interface RequestOptions {
	method?: 'GET' | 'POST';
	/** Query parameters appended to the URL. */
	params?: Record<string, string>;
	/** JSON request body (serialised automatically). */
	body?: unknown;
	signal?: AbortSignal;
}

export async function apiFetch<T>(
	path: string,
	{ method = 'GET', params, body, signal }: RequestOptions = {},
): Promise<T> {
	const url = new URL(path, BASE_URL);
	if (params) {
		for (const [key, value] of Object.entries(params)) {
			url.searchParams.set(key, value);
		}
	}

	const response = await fetch(url, {
		method,
		signal,
		headers: body ? { 'Content-Type': 'application/json' } : undefined,
		body: body ? JSON.stringify(body) : undefined,
	});

	if (!response.ok) {
		// Prefer the message the API sends back, otherwise use the status text.
		let message = response.statusText;
		try {
			const data = (await response.json()) as { message?: string };
			if (data?.message) message = data.message;
		} catch {
			// no JSON body, keep the status text
		}
		throw new ApiError(message, response.status);
	}

	return response.json() as Promise<T>;
}

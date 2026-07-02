// One function per endpoint we use, see API.md.

import { apiFetch } from './client';
import type {
	CreateOrderRequest,
	CreateOrderResponse,
	EventDetail,
	EventTickets,
	LoginResponse,
} from './types';

/** `GET /event` */
export function getEvent(signal?: AbortSignal): Promise<EventDetail> {
	return apiFetch<EventDetail>('/event', { signal });
}

/** `GET /event-tickets?eventId=<uuid>` */
export function getEventTickets(
	eventId: string,
	signal?: AbortSignal,
): Promise<EventTickets> {
	return apiFetch<EventTickets>('/event-tickets', {
		params: { eventId },
		signal,
	});
}

/** `POST /login` */
export function login(
	email: string,
	password: string,
): Promise<LoginResponse> {
	return apiFetch<LoginResponse>('/login', {
		method: 'POST',
		body: { email, password },
	});
}

/** `POST /order` */
export function createOrder(
	payload: CreateOrderRequest,
): Promise<CreateOrderResponse> {
	return apiFetch<CreateOrderResponse>('/order', {
		method: 'POST',
		body: payload,
	});
}

// Formatting helpers, all based on the built-in Intl API so we don't pull in
// another date/money library.

// e.g. "1 000 Kč" in Czech, "CZK 1,000" in English
export function formatCurrency(
	amount: number,
	currencyIso: string,
	locale: string,
): string {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: currencyIso,
		maximumFractionDigits: 0,
	}).format(amount);
}

// Formats the event's date range. If it's on a single day, show the date once
// and just the two times.
export function formatDateRange(
	fromIso: string,
	toIso: string,
	locale: string,
): string {
	const from = new Date(fromIso);
	const to = new Date(toIso);

	const date = new Intl.DateTimeFormat(locale, {
		dateStyle: 'long',
	}).format(from);
	const time = new Intl.DateTimeFormat(locale, {
		timeStyle: 'short',
	});

	const sameDay = from.toDateString() === to.toDateString();
	if (sameDay) {
		return `${date}, ${time.format(from)} – ${time.format(to)}`;
	}

	const fullTo = new Intl.DateTimeFormat(locale, {
		dateStyle: 'long',
		timeStyle: 'short',
	}).format(to);
	return `${date}, ${time.format(from)} – ${fullTo}`;
}

import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';
import { SUPPORTED_LANGUAGES } from '@/i18n';

// Small cs/en toggle in the header.
export function LanguageSwitcher() {
	const { i18n } = useTranslation();
	const current = i18n.language.startsWith('en') ? 'en' : 'cs';

	return (
		<div
			className="inline-flex rounded-md border border-zinc-200 p-0.5"
			role="group"
			aria-label="Language"
		>
			{SUPPORTED_LANGUAGES.map((lang) => (
				<button
					key={lang}
					type="button"
					onClick={() => i18n.changeLanguage(lang)}
					aria-pressed={current === lang}
					className={cn(
						'rounded px-2 py-1 text-xs font-medium uppercase transition-colors',
						current === lang
							? 'bg-zinc-900 text-zinc-50'
							: 'text-zinc-500 hover:text-zinc-900',
					)}
				>
					{lang}
				</button>
			))}
		</div>
	);
}

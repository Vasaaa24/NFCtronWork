import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';
import { SUPPORTED_LANGUAGES } from '@/i18n';

// Small cs/en toggle in the header.
export function LanguageSwitcher() {
	const { i18n } = useTranslation();
	const current = i18n.language.startsWith('en') ? 'en' : 'cs';

	return (
		<div
			className="inline-flex rounded-full bg-zinc-100 p-1 ring-1 ring-zinc-200/70"
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
						'rounded-full px-2.5 py-1 text-xs font-semibold uppercase transition-all duration-200',
						current === lang
							? 'bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-900/5'
							: 'text-zinc-500 hover:text-zinc-800',
					)}
				>
					{lang}
				</button>
			))}
		</div>
	);
}

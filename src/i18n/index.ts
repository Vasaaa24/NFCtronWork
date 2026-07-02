import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import cs from './locales/cs.json';
import en from './locales/en.json';

export const SUPPORTED_LANGUAGES = ['cs', 'en'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

const STORAGE_KEY = 'nfctron.lang';

function detectInitialLanguage(): Language {
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === 'cs' || stored === 'en') return stored;
	// otherwise guess from the browser, default to Czech
	return navigator.language.toLowerCase().startsWith('en') ? 'en' : 'cs';
}

i18n.use(initReactI18next).init({
	resources: {
		en: { translation: en },
		cs: { translation: cs },
	},
	lng: detectInitialLanguage(),
	fallbackLng: 'en',
	interpolation: { escapeValue: false }, // React escapes for us
});

i18n.on('languageChanged', (lng) => {
	localStorage.setItem(STORAGE_KEY, lng);
	document.documentElement.lang = lng;
});
document.documentElement.lang = i18n.language;

export default i18n;

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { LoginForm } from './LoginForm';

// "Login or register" button in the header that opens the login dialog.
export function LoginDialog() {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="secondary">{t('header.loginRegister')}</Button>
			</DialogTrigger>
			<DialogContent className="max-w-sm">
				<DialogHeader>
					<DialogTitle>{t('header.loginRegister')}</DialogTitle>
					<DialogDescription>{t('checkout.loginHint')}</DialogDescription>
				</DialogHeader>
				<LoginForm onSuccess={() => setOpen(false)} />
			</DialogContent>
		</Dialog>
	);
}

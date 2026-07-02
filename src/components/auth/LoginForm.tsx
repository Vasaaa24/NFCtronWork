import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useAuth } from '@/store/use-auth';
import { ApiError } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FieldError } from '@/components/ui/field-error';

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
});

type LoginValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
	// called after a successful login (e.g. to close the dialog)
	onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
	const { t } = useTranslation();
	const { login } = useAuth();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginValues>({
		resolver: zodResolver(loginSchema),
		// prefilled with the demo credentials from API.md
		defaultValues: { email: 'frontend@nfctron.com', password: 'Nfctron2025' },
	});

	const onSubmit = handleSubmit(async ({ email, password }) => {
		try {
			const user = await login(email, password);
			toast.success(t('toast.loginSuccess', { name: user.firstName }));
			onSuccess?.();
		} catch (error) {
			const message =
				error instanceof ApiError ? error.message : t('toast.loginError');
			toast.error(message);
		}
	});

	return (
		<form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="login-email">{t('checkout.email')}</Label>
				<Input
					id="login-email"
					type="email"
					autoComplete="email"
					aria-invalid={Boolean(errors.email)}
					{...register('email')}
				/>
				{errors.email && <FieldError>{t('validation.emailInvalid')}</FieldError>}
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="login-password">{t('checkout.password')}</Label>
				<Input
					id="login-password"
					type="password"
					autoComplete="current-password"
					aria-invalid={Boolean(errors.password)}
					{...register('password')}
				/>
			</div>

			<p className="text-xs text-zinc-400">{t('checkout.loginHint')}</p>

			<Button type="submit" variant="brand" disabled={isSubmitting}>
				{t('checkout.loginSubmit')}
			</Button>
		</form>
	);
}

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import type { EventDetail } from '@/api/types';
import { createOrder } from '@/api/endpoints';
import { ApiError } from '@/api/client';
import { useAuth } from '@/store/use-auth';
import { useCart } from '@/store/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FieldError } from '@/components/ui/field-error';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { LoginForm } from '@/components/auth/LoginForm';
import { OrderSummary } from './OrderSummary';

const guestSchema = z.object({
	firstName: z.string().trim().min(1),
	lastName: z.string().trim().min(1),
	email: z.string().trim().email(),
});
type GuestValues = z.infer<typeof guestSchema>;

interface CheckoutDialogProps {
	event: EventDetail;
}

// Last step of the flow: get the buyer's details (either from login or the
// guest form), send the order and show the result.
export function CheckoutDialog({ event }: CheckoutDialogProps) {
	const { t, i18n } = useTranslation();
	const { user, isLoggedIn } = useAuth();
	const { items, itemCount, total, clear } = useCart();
	const [open, setOpen] = useState(false);

	const orderMutation = useMutation({
		mutationFn: createOrder,
		onSuccess: (result) => {
			toast.success(t('toast.orderSuccessTitle'), {
				description: t('toast.orderSuccessDescription', {
					orderId: result.orderId,
				}),
			});
			clear();
			setOpen(false);
		},
		onError: (error) => {
			const message =
				error instanceof ApiError ? error.message : t('toast.orderError');
			toast.error(message);
		},
	});

	// same submit path for both the logged-in user and a guest
	function submitOrder(buyer: { email: string; firstName: string; lastName: string }) {
		orderMutation.mutate({
			eventId: event.eventId,
			tickets: items.map(({ ticketTypeId, seatId }) => ({ ticketTypeId, seatId })),
			user: buyer,
		});
	}

	const guestForm = useForm<GuestValues>({
		resolver: zodResolver(guestSchema),
	});

	const onGuestSubmit = guestForm.handleSubmit((values) => submitOrder(values));

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="default" size="lg" disabled={itemCount === 0}>
					{t('cart.checkout')}
				</Button>
			</DialogTrigger>

			<DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{t('checkout.title')}</DialogTitle>
					<DialogDescription>
						{t('checkout.description', { count: itemCount })}
					</DialogDescription>
				</DialogHeader>

				<OrderSummary
					items={items}
					total={total}
					currencyIso={event.currencyIso}
					locale={i18n.language}
				/>

				{isLoggedIn && user ? (
					// logged in - just confirm and order
					<div className="flex flex-col gap-4">
						<div className="rounded-md bg-zinc-50 p-3 text-sm">
							<p className="text-zinc-500">{t('checkout.loggedInAs')}</p>
							<p className="font-medium">
								{user.firstName} {user.lastName}
							</p>
							<p className="text-zinc-500">{user.email}</p>
						</div>
						<Button
							size="lg"
							disabled={orderMutation.isPending}
							onClick={() => submitOrder(user)}
						>
							{orderMutation.isPending
								? t('checkout.submitting')
								: t('checkout.submit')}
						</Button>
					</div>
				) : (
					// not logged in - let them fill in guest details or log in
					<Tabs defaultValue="guest">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="guest">{t('checkout.tabGuest')}</TabsTrigger>
							<TabsTrigger value="login">{t('checkout.tabLogin')}</TabsTrigger>
						</TabsList>

						<TabsContent value="guest">
							<form onSubmit={onGuestSubmit} className="flex flex-col gap-4" noValidate>
								<div className="grid grid-cols-2 gap-3">
									<div className="flex flex-col gap-1.5">
										<Label htmlFor="firstName">{t('checkout.firstName')}</Label>
										<Input
											id="firstName"
											autoComplete="given-name"
											aria-invalid={Boolean(guestForm.formState.errors.firstName)}
											{...guestForm.register('firstName')}
										/>
										{guestForm.formState.errors.firstName && (
											<FieldError>{t('validation.firstNameRequired')}</FieldError>
										)}
									</div>
									<div className="flex flex-col gap-1.5">
										<Label htmlFor="lastName">{t('checkout.lastName')}</Label>
										<Input
											id="lastName"
											autoComplete="family-name"
											aria-invalid={Boolean(guestForm.formState.errors.lastName)}
											{...guestForm.register('lastName')}
										/>
										{guestForm.formState.errors.lastName && (
											<FieldError>{t('validation.lastNameRequired')}</FieldError>
										)}
									</div>
								</div>
								<div className="flex flex-col gap-1.5">
									<Label htmlFor="email">{t('checkout.email')}</Label>
									<Input
										id="email"
										type="email"
										autoComplete="email"
										aria-invalid={Boolean(guestForm.formState.errors.email)}
										{...guestForm.register('email')}
									/>
									{guestForm.formState.errors.email && (
										<FieldError>{t('validation.emailInvalid')}</FieldError>
									)}
								</div>
								<Button type="submit" size="lg" disabled={orderMutation.isPending}>
									{orderMutation.isPending
										? t('checkout.submitting')
										: t('checkout.submit')}
								</Button>
							</form>
						</TabsContent>

						<TabsContent value="login">
							{/* after login the dialog switches to the logged-in branch above */}
							<LoginForm />
						</TabsContent>
					</Tabs>
				)}
			</DialogContent>
		</Dialog>
	);
}

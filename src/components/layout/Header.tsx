import { useTranslation } from 'react-i18next';

import { useAuth } from '@/store/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { LoginDialog } from '@/components/auth/LoginDialog';

// Top bar - logo, language switch and either the login button or the user menu.
export function Header() {
	const { t } = useTranslation();
	const { user, isLoggedIn, logout } = useAuth();

	const fullName = user ? `${user.firstName} ${user.lastName}` : '';
	const initials = user
		? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
		: '';

	return (
		<nav className="sticky top-0 left-0 right-0 z-30 bg-white border-b border-zinc-200 flex justify-center">
			<div className="max-w-screen-lg p-4 grow flex items-center justify-between gap-3">
				{/* Brand */}
				<a href="/" className="flex items-center gap-2 font-semibold text-zinc-900">
					<span className="grid size-9 place-items-center rounded-md bg-zinc-900 text-zinc-50">
						N
					</span>
					<span className="hidden sm:inline">NFCtron Tickets</span>
				</a>

				{/* Right-hand controls */}
				<div className="flex items-center gap-3">
					<LanguageSwitcher />

					{isLoggedIn ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="h-auto py-1.5">
									<div className="flex items-center gap-2">
										<Avatar className="size-8">
											<AvatarImage
												src={`https://source.boringavatars.com/marble/120/${encodeURIComponent(
													user!.email,
												)}?colors=25106C,7F46DB`}
											/>
											<AvatarFallback>{initials}</AvatarFallback>
										</Avatar>
										<div className="hidden sm:flex flex-col text-left">
											<span className="text-sm font-medium">{fullName}</span>
											<span className="text-xs text-zinc-500">{user!.email}</span>
										</div>
									</div>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-[250px]">
								<DropdownMenuLabel>{fullName}</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem onSelect={logout}>
										{t('header.logout')}
									</DropdownMenuItem>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<LoginDialog />
					)}
				</div>
			</div>
		</nav>
	);
}

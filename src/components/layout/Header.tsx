import { LogOut } from 'lucide-react';
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
		<nav className="sticky top-0 left-0 right-0 z-30 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md flex justify-center">
			<div className="max-w-screen-xl w-full px-4 sm:px-6 py-3 grow flex items-center justify-between gap-3">
				{/* Brand */}
				<a
					href="/"
					className="flex items-center gap-2.5 font-semibold text-zinc-900 group"
				>
					<span className="grid size-9 place-items-center rounded-xl bg-brand-600 text-white font-bold shadow-sm transition-transform group-hover:scale-105">
						N
					</span>
					<span className="hidden sm:flex flex-col leading-none">
						<span className="text-sm">NFCtron</span>
						<span className="text-[11px] font-normal text-zinc-400">Tickets</span>
					</span>
				</a>

				{/* Right-hand controls */}
				<div className="flex items-center gap-2 sm:gap-3">
					<LanguageSwitcher />

					{isLoggedIn ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="h-auto py-1.5 rounded-full sm:rounded-md"
								>
									<div className="flex items-center gap-2">
										<Avatar className="size-8 ring-2 ring-brand-100">
											<AvatarImage
												src={`https://source.boringavatars.com/marble/120/${encodeURIComponent(
													user!.email,
												)}?colors=25106C,7F46DB`}
											/>
											<AvatarFallback>{initials}</AvatarFallback>
										</Avatar>
										<div className="hidden sm:flex flex-col text-left leading-tight">
											<span className="text-sm font-medium">{fullName}</span>
											<span className="text-xs text-zinc-500">{user!.email}</span>
										</div>
									</div>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-[250px]" align="end">
								<DropdownMenuLabel className="flex flex-col">
									<span>{fullName}</span>
									<span className="text-xs font-normal text-zinc-500">
										{user!.email}
									</span>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem
										onSelect={logout}
										className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
									>
										<LogOut className="size-4" />
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

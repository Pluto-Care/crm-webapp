import {Hospital, LogOut, MoonStarIcon, Settings, SunIcon} from "lucide-react";

import {Button} from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {useAuth, useSignOut} from "@/contexts/auth";
import {useTheme} from "@/components/theme-provider";
import {Skeleton} from "@/components/ui/skeleton";
import {SidebarMobile} from "./Sidebar";

export default function Topbar() {
	const {theme, setTheme} = useTheme();
	const auth_context = useAuth();
	const {loading, signOut} = useSignOut();

	return (
		<header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md flex h-14 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6">
			<SidebarMobile />
			<div className="flex-1 w-full">
				<h4>Welcome, {auth_context.user?.detail.first_name}</h4>
			</div>
			<div className="flex items-center gap-4">
				<div className="flex items-center">
					<Button
						variant={"outline"}
						className="p-0 bg-transparent border-0 rounded-lg hover:bg-black/5 hover:dark:bg-white/10 aspect-square"
						onClick={() => {
							setTheme(theme === "dark" ? "light" : "dark");
						}}
					>
						{theme === "dark" ? (
							<MoonStarIcon className="w-5 h-5" />
						) : (
							<SunIcon className="w-5 h-5" />
						)}
					</Button>
				</div>
				<div className="flex items-center">
					{auth_context.org ? (
						<div className="flex items-center gap-2 px-2.5 py-1 min-w-40 text-sm border rounded-lg">
							<Hospital strokeWidth={1.75} absoluteStrokeWidth className="size-5" />
							<div>
								<div className="font-medium leading-4">{auth_context.org.name}</div>
								<div className="leading-4 text-muted-foreground">
									{auth_context.org.city}, {auth_context.org.state}
								</div>
							</div>
						</div>
					) : (
						<Skeleton className="h-9 w-[250px]" />
					)}
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="secondary"
							size="icon"
							className="rounded-full bg-gradient-to-br from-[#f7c17a] to-[#cda9f5] dark:from-[#ce653b] dark:to-[#2b0948]"
						>
							<span>
								{(auth_context.user?.detail.first_name[0] || "") +
									(auth_context.user?.detail.last_name[0] || "")}
							</span>
							<span className="sr-only">Toggle user menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem className="flex items-center gap-2 pr-8">
							<Settings className="size-4" />
							Settings
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="flex items-center gap-2 pr-8"
							onClick={signOut}
							disabled={loading}
						>
							<LogOut className="size-4" />
							Logout
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}

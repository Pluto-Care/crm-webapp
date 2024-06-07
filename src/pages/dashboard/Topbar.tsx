import {Hospital, MoonStarIcon, SunIcon} from "lucide-react";

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
import {useQuery} from "@tanstack/react-query";
import {getMyOrgAPI} from "@/services/api/organization/me";
import {Skeleton} from "@/components/ui/skeleton";
import {SidebarMobile} from "./Sidebar";

export default function Topbar() {
	const {theme, setTheme} = useTheme();
	const auth_context = useAuth();
	const {loading, signOut} = useSignOut();
	const org_query = useQuery({
		queryKey: ["my_org"],
		queryFn: () => getMyOrgAPI(),
		refetchOnWindowFocus: false,
		retry: 1,
	});

	return (
		<header className="flex h-14 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6">
			<SidebarMobile />
			<div className="flex-1 w-full">
				<h4>Welcome, {auth_context.user?.detail.first_name}</h4>
			</div>
			<div className="flex items-center gap-4">
				<div className="flex items-center">
					<Button
						variant={"outline"}
						className="p-0 border-0 rounded-lg aspect-square"
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
					{org_query.isSuccess ? (
						<div className="flex items-center gap-2 px-2.5 py-1 text-sm border rounded-lg">
							<Hospital strokeWidth={1.75} absoluteStrokeWidth className="size-5" />
							<div>
								<div className="font-medium leading-4">{org_query.data.name}</div>
								<div className="leading-4 text-muted-foreground">
									{org_query.data.city}, {org_query.data.state}
								</div>
							</div>
						</div>
					) : org_query.isLoading ? (
						<Skeleton className="h-9 w-[250px]" />
					) : (
						<></>
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
						<DropdownMenuItem>Settings</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={signOut} disabled={loading}>
							Logout
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}

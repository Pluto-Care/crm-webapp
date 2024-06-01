import {
	Bell,
	ContactIcon,
	HomeIcon,
	Menu,
	MessageCircleQuestionIcon,
	MessagesSquareIcon,
	MoonStarIcon,
	PhoneCallIcon,
	SunIcon,
	Users,
	UsersIcon,
	ZapIcon,
} from "lucide-react";

import {Button} from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {Link} from "react-router-dom";
import Logo from "@/assets/images/full-logo.svg";
import {useAuth, useSignOut} from "@/contexts/auth";
import SidebarItemMenu, {MenuItem as SidebarMenuItem} from "./SidebarItemMenu";
import {useTheme} from "@/components/theme-provider";

const adminMenu: SidebarMenuItem[] = [
	{
		title: "Dashboard",
		Icon: HomeIcon,
		path: "/dashboard/admin",
	},
	{
		title: "Doctors",
		Icon: ContactIcon,
		path: "/dashboard/admin-doctors",
	},
	{
		title: "Patients",
		Icon: UsersIcon,
		path: "/dashboard/admin-patients",
	},
];

const forYouMenu: SidebarMenuItem[] = [
	{
		title: "Quick Summary",
		Icon: ZapIcon,
		path: "/dashboard",
	},
	{
		title: "My Patients",
		Icon: ContactIcon,
		path: "/dashboard/patients",
	},
	{
		title: "Appointment Calendar",
		Icon: Users,
		path: "/dashboard/appointments",
	},
];

const talksMenu: SidebarMenuItem[] = [
	{
		title: "Messages",
		Icon: MessagesSquareIcon,
		path: "/dashboard/messages",
	},
	{
		title: "Patient Calls",
		Icon: PhoneCallIcon,
		path: "/dashboard/calls",
	},
];

const bottomNavMenu: SidebarMenuItem[] = [
	{
		title: "Help Center",
		Icon: MessageCircleQuestionIcon,
		path: "/help",
	},
];

export default function Dashboard() {
	const {theme, setTheme} = useTheme();
	const auth_context = useAuth();
	const {loading, signOut} = useSignOut();

	return (
		<div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
			<div className="hidden border-r bg-zinc-900 md:block">
				<div className="flex flex-col h-full max-h-screen gap-2">
					<div className="flex h-14 items-center border-b border-zinc-800 px-4 lg:h-[60px] lg:px-6">
						<Link to="/" className="flex items-center gap-2 font-semibold">
							<img src={Logo} alt="Logo" className="h-5 invert brightness-75" />
						</Link>
						<Button
							variant="outline"
							size="icon"
							className="w-8 h-8 ml-auto text-white bg-black border-zinc-800"
						>
							<Bell className="w-4 h-4" />
							<span className="sr-only">Toggle notifications</span>
						</Button>
					</div>
					<div className="flex-1">
						<nav className="grid items-start px-2 text-sm font-medium lg:px-4">
							<SidebarItemMenu menuTitle="Admin Menu" items={adminMenu} />
							<SidebarItemMenu menuTitle="For You Menu" items={forYouMenu} />
							<SidebarItemMenu menuTitle="Talks" items={talksMenu} />
						</nav>
					</div>
					<div className="p-4 mt-auto">
						<nav className="grid items-start px-2 text-sm font-medium lg:px-4">
							<SidebarItemMenu items={bottomNavMenu} />
						</nav>
					</div>
				</div>
			</div>
			<div className="flex flex-col">
				<header className="flex h-14 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6">
					<Sheet>
						<SheetTrigger asChild>
							<Button variant="outline" size="icon" className="shrink-0 md:hidden">
								<Menu className="w-5 h-5" />
								<span className="sr-only">Toggle navigation menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="flex flex-col">
							<nav className="grid gap-2 text-lg font-medium">
								<SidebarItemMenu menuTitle="Admin Menu" items={adminMenu} isMobile={true} />
								<SidebarItemMenu menuTitle="For You Menu" items={forYouMenu} isMobile={true} />
								<SidebarItemMenu menuTitle="Talks" items={talksMenu} isMobile={true} />
							</nav>
							<div className="mt-auto">
								<nav className="grid gap-2 text-lg font-medium">
									<SidebarItemMenu items={bottomNavMenu} isMobile={true} />
								</nav>
							</div>
						</SheetContent>
					</Sheet>
					<div className="flex-1 w-full">
						<h4>Welcome, {auth_context.user?.detail.first_name}</h4>
					</div>
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<Button
								variant={"outline"}
								className="p-0 border-0 rounded-full aspect-square"
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
				<main className="flex flex-col flex-1 gap-4 p-4 lg:gap-6 lg:p-6">
					<div className="flex items-center">
						<h1 className="text-lg font-semibold md:text-2xl">Quick Summary</h1>
					</div>
					<div></div>
				</main>
			</div>
		</div>
	);
}

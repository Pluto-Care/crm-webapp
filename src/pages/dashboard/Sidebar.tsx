import {
	Bell,
	CalendarCheck,
	ContactIcon,
	HomeIcon,
	Menu,
	MessageCircleQuestionIcon,
	MessagesSquareIcon,
	PhoneCallIcon,
	Users,
	UsersIcon,
	ZapIcon,
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Link} from "react-router-dom";
import Logo from "@/assets/images/full-logo.svg";
import SidebarItemMenu, {MenuItem as SidebarMenuItem} from "./SidebarItemMenu";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {READ_ALL_PATIENTS, READ_ALL_USERS} from "@/permissions/permissions";

const adminMenu: SidebarMenuItem[] = [
	{
		title: "Admin Dash",
		Icon: HomeIcon,
		path: "/dashboard/admin/home",
	},
	{
		title: "Users",
		Icon: ContactIcon,
		path: "/dashboard/admin/users",
		need_permission: READ_ALL_USERS,
	},
	{
		title: "Patients",
		Icon: UsersIcon,
		path: "/dashboard/admin/patients",
		need_permission: READ_ALL_PATIENTS,
	},
	{
		title: "Appointments",
		Icon: CalendarCheck,
		path: "/dashboard/admin/appointments",
	},
];

const forYouMenu: SidebarMenuItem[] = [
	{
		title: "Quick Summary",
		Icon: ZapIcon,
		path: "/dashboard/my/summary",
	},
	{
		title: "My Patients",
		Icon: ContactIcon,
		path: "/dashboard/my/patients",
	},
	{
		title: "My Appointments",
		Icon: Users,
		path: "/dashboard/my/appointments",
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

export default function Sidebar() {
	return (
		<div className="relative hidden border-r bg-zinc-900 md:block">
			<div className="sticky top-0 flex flex-col h-full max-h-screen gap-2 overflow-y-auto">
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
						<SidebarItemMenu menuTitle="Manage" items={adminMenu} />
						<SidebarItemMenu menuTitle="For You" items={forYouMenu} />
						<SidebarItemMenu menuTitle="Talks" items={talksMenu} />
					</nav>
				</div>
				<div className="mt-auto mb-4">
					<nav className="grid items-start px-2 text-sm font-medium lg:px-4">
						<SidebarItemMenu items={bottomNavMenu} />
					</nav>
				</div>
			</div>
		</div>
	);
}

export function SidebarMobile() {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline" size="icon" className="shrink-0 md:hidden">
					<Menu className="w-5 h-5" />
					<span className="sr-only">Toggle navigation menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="flex flex-col">
				<nav className="grid gap-2 text-lg font-medium">
					<SidebarItemMenu menuTitle="Manage" items={adminMenu} isMobile={true} />
					<SidebarItemMenu menuTitle="For You" items={forYouMenu} isMobile={true} />
					<SidebarItemMenu menuTitle="Talks" items={talksMenu} isMobile={true} />
				</nav>
				<div className="mt-auto">
					<nav className="grid gap-2 text-lg font-medium">
						<SidebarItemMenu items={bottomNavMenu} isMobile={true} />
					</nav>
				</div>
			</SheetContent>
		</Sheet>
	);
}

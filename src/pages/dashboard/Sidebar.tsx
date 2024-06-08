import {
	Bell,
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

const adminMenu: SidebarMenuItem[] = [
	{
		title: "Admin Dash",
		Icon: HomeIcon,
		path: "/dashboard/admin",
	},
	{
		title: "Doctors",
		Icon: ContactIcon,
		path: "/dashboard/admin/doctors",
	},
	{
		title: "Patients",
		Icon: UsersIcon,
		path: "/dashboard/admin/patients",
		need_permission: "read:patients",
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

export default function Sidebar() {
	return (
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
	);
}

import Logo from "@/assets/images/full-logo.svg";
import Topbar from "../Topbar";
import {Link} from "react-router-dom";
import {ArrowLeft, Mail, MonitorSmartphone, ShieldCheck} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

export default function SettingsPage() {
	return (
		<div>
			<div className="border-b">
				<div className="container flex gap-8">
					<div className="flex items-center gap-4">
						<img src={Logo} alt="Logo" className="h-6 dark:invert" />
					</div>
					<div className="flex-1">
						<Topbar />
					</div>
				</div>
			</div>
			<div className="container py-8">
				<Link to="/dashboard" className="flex items-center gap-2 text-[90%] text-primary">
					<ArrowLeft className="w-4 h-4" />
					<span>Back to Dashboard</span>
				</Link>
				<h1 className="mt-3 mb-6 text-4xl font-bold">Settings</h1>
				<Tabs defaultValue="account" className="w-full my-8">
					<div className="relative flex items-start gap-8">
						<TabsList className="flex flex-col gap-0.5 !h-auto min-w-64 sticky p-2 top-20">
							<TabsTrigger value="account" className="justify-start w-full text-[90%] py-1.5">
								<ShieldCheck className="w-5 h-5 mr-3" />
								Account Settings
							</TabsTrigger>
							<TabsTrigger
								value="active_devices"
								className="justify-start w-full text-[90%] py-1.5"
							>
								<MonitorSmartphone className="w-5 h-5 mr-3" />
								Active Devices
							</TabsTrigger>
							<TabsTrigger value="email_prefs" className="justify-start w-full text-[90%] py-1.5">
								<Mail className="w-5 h-5 mr-3" />
								Email Preferences
							</TabsTrigger>
						</TabsList>
						<div className="flex-1">
							<div>
								<TabsContent value="account" className="!mt-0"></TabsContent>
								<TabsContent value="active_devices" className="!mt-0"></TabsContent>
								<TabsContent value="email_prefs" className="!mt-0"></TabsContent>
							</div>
						</div>
					</div>
				</Tabs>
			</div>
		</div>
	);
}

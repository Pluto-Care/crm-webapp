import React from "react";
import Topbar from "./Topbar";
import {Toaster} from "@/components/ui/sonner";
const Sidebar = React.lazy(() => import("./Sidebar"));

interface Props {
	children: React.ReactNode;
}

export default function DashboardLayout(props: Props) {
	return (
		<div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] relative">
			<Sidebar />
			<div className="flex flex-col">
				<div className="border-b">
					<Topbar />
				</div>
				<main className="p-4 lg:p-6 max-w-[1600px]">
					{/* Main section start */}
					{props.children}
					{/* Main section end */}
					<Toaster />
				</main>
			</div>
		</div>
	);
}

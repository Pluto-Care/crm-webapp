import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout(props: {children: React.ReactNode}) {
	return (
		<div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
			<Sidebar />
			<div className="flex flex-col">
				<Topbar />
				<main className="p-4 lg:p-6">
					{/* Main section start */}
					{props.children}
					{/* Main section end */}
				</main>
			</div>
		</div>
	);
}

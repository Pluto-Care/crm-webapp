import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import {useQuery} from "@tanstack/react-query";
import {getMyOrgAPI} from "@/services/api/organization/me";

export default function DashboardLayout(props: {children: React.ReactNode}) {
	const org_query = useQuery({
		queryKey: ["my_org"],
		queryFn: () => getMyOrgAPI(),
		refetchOnWindowFocus: false,
		retry: 1,
	});

	return (
		<div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] relative">
			<Sidebar />
			<div className="flex flex-col">
				<Topbar organization={org_query.data} />
				<main className="p-4 lg:p-6">
					{/* Main section start */}
					{props.children}
					{/* Main section end */}
				</main>
			</div>
		</div>
	);
}

import {Badge, LucideProps} from "lucide-react";
import {Link} from "react-router-dom";

export type MenuItem = {
	title: string;
	Icon: React.ForwardRefExoticComponent<
		Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
	>;
	path: string;
	badge?: string;
};

export default function SidebarItemMenu({
	menuTitle,
	items,
	isMobile = false,
}: {
	menuTitle?: string;
	items: MenuItem[];
	isMobile?: boolean;
}) {
	const location = window.location.pathname;

	return (
		<>
			{menuTitle && (
				<div className="px-3 mt-8 mb-3">
					<span className={(isMobile ? "text-base" : "text-sm") + " uppercase text-zinc-400"}>
						{menuTitle}
					</span>
				</div>
			)}
			{!isMobile
				? items.map((item) => (
						<Link
							to={item.path}
							className={
								(location === item.path ? "bg-zinc-800" : "bg-transparent") +
								" flex items-center gap-3 px-3 py-2 transition-all rounded-lg text-zinc-100 hover:text-primary"
							}
						>
							<item.Icon className="w-4 h-4" />
							{item.title}
							{item.badge && (
								<Badge className="flex items-center justify-center w-6 h-6 ml-auto rounded-full shrink-0">
									{item.badge}
								</Badge>
							)}
						</Link>
				  ))
				: items.map((item) => (
						<Link
							to={item.path}
							className={
								(location === item.path ? "bg-zinc-200 dark:bg-zinc-800" : "bg-transparent") +
								" mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
							}
						>
							<item.Icon className="w-5 h-5" />
							{item.title}
							{item.badge && (
								<Badge className="flex items-center justify-center w-6 h-6 ml-auto rounded-full shrink-0">
									{item.badge}
								</Badge>
							)}
						</Link>
				  ))}
		</>
	);
}

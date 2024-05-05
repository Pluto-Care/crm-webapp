import { useDocTheme } from "use-doc-theme";

export default function ThemeToggler() {
	const theme = useDocTheme();

	return (
		<div className="inline-flex">
			<div
				className="darkmode-toggle"
				onClick={() => {
					theme.toggle();
				}}
				title="Toggle Theme"
			>
				<button></button>
			</div>
			<button
				className="ml-3 bg-gray-500/30 rounded-full px-3 text-sm font-medium"
				onClick={() => {
					theme.system();
				}}
			>
				{"System selected: " + theme.isSystemMode.toString()}
			</button>
		</div>
	);
}

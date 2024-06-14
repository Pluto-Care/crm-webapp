export default function SunRays({color}: {color: "red" | "green" | "blue" | "purple"}) {
	const bg_color =
		color === "red"
			? "to-red-100 dark:to-red-800/10"
			: color === "green"
			? "to-green-100 dark:to-green-800/10"
			: color === "blue"
			? "to-blue-100 dark:to-blue-800/10"
			: "to-purple-100 dark:to-purple-800/10";

	return (
		<div
			className={`${bg_color} fixed w-full -m-8 -mt-28 blur-sm bg-gradient-to-tr from-transparent via-transparent -z-20 h-2/3`}
		>
			<div className="w-full h-2 -rotate-45 bg-gradient-to-r from-transparent to-white dark:to-background"></div>
			<div className="w-full h-2 mt-8 -rotate-45 bg-gradient-to-r from-transparent to-white dark:to-background"></div>
			<div className="w-full h-2 mt-8 -rotate-45 bg-gradient-to-r from-transparent to-white dark:to-background"></div>
			<div className="w-full h-2 mt-8 -rotate-45 bg-gradient-to-r from-transparent to-white dark:to-background"></div>
			<div className="w-full h-2 mt-8 -rotate-45 bg-gradient-to-r from-transparent to-white dark:to-background"></div>
			<div className="w-full h-2 mt-8 -rotate-45 bg-gradient-to-r from-transparent to-white dark:to-background"></div>
			<div className="w-full h-2 mt-8 -rotate-45 bg-gradient-to-r from-transparent to-white dark:to-background"></div>
			<div className="w-full h-2 mt-8 -rotate-45 bg-gradient-to-r from-transparent to-white dark:to-background"></div>
			<div className="w-full h-2 mt-8 -rotate-45 bg-gradient-to-r from-transparent to-white dark:to-background"></div>
			<div className="w-full h-2 mt-8 -rotate-45 bg-gradient-to-r from-transparent to-white dark:to-background"></div>
			<div className="w-full h-2 mt-8 -rotate-45 bg-gradient-to-r from-transparent to-white dark:to-background"></div>
			<div className="w-full h-2 mt-8 -rotate-45 bg-gradient-to-r from-transparent to-white dark:to-background"></div>
			<div className="w-full h-2 mt-8 -rotate-45 bg-gradient-to-r from-transparent to-white dark:to-background"></div>
			<div className="w-full h-2 mt-8 -rotate-45 bg-gradient-to-r from-transparent to-white dark:to-background"></div>
			<div className="w-full h-2 mt-8 -rotate-45 bg-gradient-to-r from-transparent to-white dark:to-background"></div>
			<div className="w-full h-2 mt-8 -rotate-45 bg-gradient-to-r from-transparent to-white dark:to-background"></div>
			<div className="w-full h-2 mt-8 -rotate-45 bg-gradient-to-r from-transparent to-white dark:to-background"></div>
			<div className="w-full h-2 mt-8 -rotate-45 bg-gradient-to-r from-transparent to-white dark:to-background"></div>
			<div className="w-full h-2 mt-8 -rotate-45 bg-gradient-to-r from-transparent to-white dark:to-background"></div>
		</div>
	);
}

import ThemeToggler from "@/components/utils/ThemeToggler";
import { BACKEND_ENDPOINT } from "@/config";
import { getPosts } from "@/services/api";
import { useQuery } from "react-query";

export default function Home() {
	const post_id = "7";
	const query = useQuery("posts", () => getPosts(post_id));

	return (
		<div className="container max-w-5xl px-4 mx-auto my-6 py-4">
			<div className="flex place-items-center mb-8">
				<div className="flex-1">
					<h2 className="text-5xl font-black font-serif leading-8">RVTT</h2>
					<span className="text-sm px-px text-gray-600 dark:text-gray-400">
						React + Vite + TanStack Query + Tailwind
					</span>
				</div>
				<div>
					<ThemeToggler />
				</div>
			</div>
			<h4 className="my-3 mt-6 text-2xl font-black">Imports</h4>
			<p className="text-gray-600 dark:text-gray-400">
				Path <code>@/Example</code> is equivalent to <code>./src/Example</code>.
			</p>
			<h4 className="my-3 mt-6 text-2xl font-black">Hooks</h4>
			<p className="text-gray-600 dark:text-gray-400">
				Some useful hooks are provided in <code>/src/hooks</code>.
				<br />
				<code>useDocTheme</code> and <code>useLocalStorage</code> are available as
				part of a{" "}
				<a href="https://www.npmjs.com/package/use-doc-theme">library</a>.
			</p>

			<h4 className="my-3 mt-6 text-2xl font-black">Services</h4>
			<p className="text-gray-600 dark:text-gray-400">
				An example of <code>axios</code> call is in <code>/src/services</code>.
				<br />
				This can be combined with <code>react-query</code> to do network requests,
				example in <code>/src/components/Home.tsx</code>.
				<br />
				<div className="dark:bg-gray-300/10 bg-gray-200 font-mono rounded-md px-2 flex place-items-center mt-6">
					<div className="text-gray-700/50 dark:text-white/50 font-medium tracking-wide px-3 border-r py-1 border-r-gray-400/20">
						GET
					</div>
					<div className="text-sm px-3 tracking-tight">
						{BACKEND_ENDPOINT + "/posts/" + post_id}
					</div>
				</div>
				{query.isLoading ? (
					<>Fetching...</>
				) : query.isSuccess ? (
					<pre className="mt-2 mb-4">
						<code>{JSON.stringify(query.data, null, 2)}</code>
					</pre>
				) : query.isError ? (
					<>Error occured during fetching.</>
				) : (
					<></>
				)}
				<a href="https://tanstack.com/query/v3/docs/react/overview">
					See more about it here
				</a>
			</p>
			<h4 className="my-3 mt-6 text-2xl font-black">Types</h4>
			<p className="text-gray-600 dark:text-gray-400">
				Use <code>/src/types</code> for global types spanning whole project.
			</p>
			<h4 className="my-3 mt-6 text-2xl font-black text-green-600 dark:text-green-300">
				TailwindCSS &#10003;
			</h4>
			<br />
			<a href="https://nzran.com">Check out more!</a>
		</div>
	);
}

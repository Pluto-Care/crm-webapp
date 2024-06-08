import {Loader2} from "lucide-react";

export function LoadingScreen({message}: {message?: string}) {
	return (
		<div className="flex flex-col items-center justify-center animate-fade-in min-h-72">
			<Loader2 className="w-10 h-10 animate-spin" color={"#888888"} />
			{message && <p className="ml-2 text-sm text-muted-foreground">{message}</p>}
		</div>
	);
}

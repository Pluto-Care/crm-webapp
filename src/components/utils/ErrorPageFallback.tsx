import {AlertCircle} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "../ui/alert";

export default function ErrorPageFallback({title, message}: {title: string; message: string}) {
	const location = window.location;

	return (
		<div className="flex items-center justify-center min-h-screen">
			{/* This error occurs if network request fails. Possible cause is
			inability to reach backend server */}
			<div className="w-full max-w-md py-12">
				<Alert variant={"destructive"} className="mt-8">
					<AlertCircle className="w-6 h-6" />
					<AlertTitle className="ml-2 -mt-0.5 text-lg">{title}</AlertTitle>
					<AlertDescription className="ml-2 text-base text-foreground">
						<p>{message}</p>
						<p className="!mt-2">
							<span className="text-sm text-muted-foreground">URL: {location.href}</span>
						</p>
					</AlertDescription>
				</Alert>
			</div>
		</div>
	);
}

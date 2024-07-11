import {AlertCircle} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "../ui/alert";

export function ErrorMessageAlert({
	title,
	message,
	size,
}: {
	title: string;
	message: string;
	size?: "sm" | "base";
}) {
	if (size === "sm") {
		return (
			<Alert variant={"destructive"} className="p-2.5">
				<AlertCircle className="w-4 h-4" />
				<AlertTitle className="ml-2 mt-0.5 text-md">{title}</AlertTitle>
				<AlertDescription className="!-mt-1 ml-2">
					<p className="!leading-5 text-sm text-foreground">{message}</p>
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<Alert variant={"destructive"}>
			<AlertCircle className="w-5 h-5" />
			<AlertTitle className="ml-2 -mt-0.5 text-md">{title}</AlertTitle>
			<AlertDescription className="ml-2 text-foreground">
				<p>{message}</p>
			</AlertDescription>
		</Alert>
	);
}

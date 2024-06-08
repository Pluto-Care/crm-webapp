import {AlertCircle} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "../ui/alert";

export function ErrorMessageAlert({title, message}: {title: string; message: string}) {
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

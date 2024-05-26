import {useTheme} from "@/components/theme-provider";
import {Button} from "@/components/ui/button";
import {useSignOut} from "@/contexts/auth";
import {Loader2} from "lucide-react";

export default function Dashboard() {
	const {signOut, loading} = useSignOut();
	const {setTheme} = useTheme();

	return (
		<>
			<div>Dashboard</div>
			<Button onClick={() => setTheme("dark")}>Dark</Button>
			<Button onClick={() => setTheme("light")}>Light</Button>
			<Button onClick={signOut} disabled={loading}>
				{loading ? (
					<>
						<Loader2 className="w-4 h-4 mr-2 animate-spin" />
						Signing out...
					</>
				) : (
					<>Sign Out</>
				)}
			</Button>
		</>
	);
}

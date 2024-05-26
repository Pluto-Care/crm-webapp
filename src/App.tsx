/* Router */
import {
	Route,
	Routes,
	BrowserRouter as Router,
	Navigate,
	Outlet,
	useLocation,
} from "react-router-dom";
/* CSS */
import "@/assets/styles/global.css";
import "@/assets/styles/icons.css";
/* Components */
import Home from "@/pages/_index";
import {useAuth, useRefresh} from "@/contexts/auth";
import Dashboard from "@/pages/dashboard/_index";
import {useEffect} from "react";
import {AlertCircle, Loader2} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AxiosRequestErrorDetail} from "@/lib/handleAxiosError";

export default function App() {
	const {refresh, loading, error, isSuccess} = useRefresh();

	useEffect(() => {
		// Get logged in user if we have `auth` cookie
		refresh();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return !isSuccess && loading ? (
		<div className="flex items-center justify-center min-h-screen">
			{/* This loader is shown when user is being fetched */}
			<Loader2 className="w-10 h-10 animate-spin" color={"#888888"} />
		</div>
	) : error && error.status === 0 ? (
		<div className="flex items-center justify-center min-h-screen">
			{/* This error occurs if network request fails. Possible cause is
			inability to reach backend server */}
			<div className="w-full max-w-md py-12">
				<Alert variant={"destructive"} className="mt-8">
					<AlertCircle className="w-6 h-6" />
					<AlertTitle className="ml-2 text-lg">{error.title}</AlertTitle>
					<AlertDescription className="mt-4 ml-2 text-base text-foreground">
						<p>When trying to reach</p>
					</AlertDescription>
					<AlertDescription className="mt-2 ml-2 text-muted-foreground">
						<code>{(error.detail as AxiosRequestErrorDetail).url}</code>{" "}
						<code>{(error.detail as AxiosRequestErrorDetail).method?.toUpperCase()}</code>{" "}
						<code>
							{(error.detail as AxiosRequestErrorDetail).withCredentials ? "WithCredentials" : ""}
						</code>
						<br />
						<code>On page: {window.location.href}</code>
					</AlertDescription>
					<AlertDescription className="mt-4 ml-2 text-base text-foreground">
						<p>
							Please make sure your internet connection is working and refresh this page to try
							again.
						</p>
						<p>
							Contact support if you continue to get this error and attach this error as screenshot.
						</p>
					</AlertDescription>
				</Alert>
			</div>
		</div>
	) : (
		<Router>
			{/* In any other case, give access to routes */}
			<Routes>
				<Route path={"/"} element={<Home />} />
				{/* Protected Routes Start */}
				<Route element={<ProtectedRoute />}>
					<Route path={"/dashboard"} element={<Dashboard />} />
				</Route>
				{/* Protected Routes End */}
			</Routes>
		</Router>
	);
}

const ProtectedRoute = ({redirectPath = "/"}) => {
	const context = useAuth();
	const location = useLocation();

	if (!context.user) {
		return <Navigate to={redirectPath} state={{redirectTo: location}} replace />;
	}

	return <Outlet />;
};

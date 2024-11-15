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
import {HasPermission, useAuth, useRefresh} from "@/contexts/auth";
import React, {Suspense, useEffect} from "react";
import {AlertCircle, Loader2} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AxiosRequestErrorDetail, ErrorType} from "@/lib/handleAxiosError";
import ErrorPageFallback from "./components/utils/ErrorPageFallback";
import PatientDetailPage from "./pages/dashboard/admin/patients/patient/_index";
import {LoadingScreen} from "./components/utils/LoadingScreen";
import {READ_ALL_PATIENTS, READ_ALL_USERS, VIEW_ALL_APPOINTMENTS} from "./permissions/permissions";
import AppointmentsDashboard from "./pages/dashboard/my/appointments/_index";
import MyAppointmentDetailPage from "./pages/dashboard/my/appointments/appointment/_index";
import MyPatientsDashboard from "./pages/dashboard/my/patients/_index";
import ResetPasswordCompletionPage from "./pages/reset_password/_index";

const Dashboard = React.lazy(() => import("@/pages/dashboard/_index"));
const LoginPage = React.lazy(() => import("@/pages/login/_index"));
const AdminPatientsDashboard = React.lazy(() => import("@/pages/dashboard/admin/patients/_index"));
const AdminUsersDashboard = React.lazy(() => import("@/pages/dashboard/admin/users/_index"));
const UserDetailPage = React.lazy(() => import("@/pages/dashboard/admin/users/user/_index"));
const AdminAppointmentsDashboard = React.lazy(
	() => import("@/pages/dashboard/admin/appointments/_index")
);
const AppointmentDetailPage = React.lazy(
	() => import("@/pages/dashboard/admin/appointments/appointment/_index")
);
const SettingsPage = React.lazy(() => import("@/pages/dashboard/settings/_index"));

export default function App() {
	const {refresh, loading, error, isSuccess} = useRefresh();

	useEffect(() => {
		// Get logged in user if we have `auth` cookie
		refresh();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return !isSuccess && loading ? (
		<div className="flex items-center justify-center min-h-screen">
			<Loader2 className="w-10 h-10 animate-spin" color={"#888888"} />
		</div>
	) : error && error.status === 0 ? (
		<NetworkError error={error} />
	) : (
		<Router>
			{/* In any other case, give access to routes */}
			<Routes>
				<Route
					path={"/"}
					element={
						<SW>
							<LoginPage />
						</SW>
					}
				/>
				<Route
					path={"/login"}
					element={
						<SW>
							<LoginPage />
						</SW>
					}
				/>
				<Route
					path={"/forgot-password/complete"}
					element={
						<SW>
							<ResetPasswordCompletionPage />
						</SW>
					}
				/>
				<Route element={<ProtectedRoute />}>
					{/* Protected Routes Start */}
					<Route
						path={"/dashboard"}
						element={
							<SW>
								<Dashboard />
							</SW>
						}
					/>
					<Route
						path={"/settings"}
						element={
							<SW>
								<SettingsPage />
							</SW>
						}
					/>
					<Route
						path={"/dashboard/admin/patients"}
						element={
							<SW>
								<HasPermission
									id={READ_ALL_PATIENTS}
									fallback={
										<ErrorPageFallback
											title="Permission Denied"
											message="You do not have permission to view this page."
										/>
									}
								>
									<AdminPatientsDashboard />
								</HasPermission>
							</SW>
						}
					/>
					<Route
						path={"/dashboard/admin/patients/:patient_id"}
						element={
							<SW>
								<HasPermission
									id={READ_ALL_PATIENTS}
									fallback={
										<ErrorPageFallback
											title="Permission Denied"
											message="You do not have permission to view this page."
										/>
									}
								>
									<PatientDetailPage />
								</HasPermission>
							</SW>
						}
					/>

					<Route
						path={"/dashboard/admin/users"}
						element={
							<SW>
								<HasPermission
									id={READ_ALL_USERS}
									fallback={
										<ErrorPageFallback
											title="Permission Denied"
											message="You do not have permission to view this page."
										/>
									}
								>
									<AdminUsersDashboard />
								</HasPermission>
							</SW>
						}
					/>
					<Route
						path={"/dashboard/admin/users/:user_id"}
						element={
							<SW>
								<HasPermission
									id={READ_ALL_USERS}
									fallback={
										<ErrorPageFallback
											title="Permission Denied"
											message="You do not have permission to view this page."
										/>
									}
								>
									<UserDetailPage />
								</HasPermission>
							</SW>
						}
					/>
					<Route
						path={"/dashboard/admin/appointments"}
						element={
							<SW>
								<HasPermission
									id={VIEW_ALL_APPOINTMENTS}
									fallback={
										<ErrorPageFallback
											title="Permission Denied"
											message="You do not have permission to view this page."
										/>
									}
								>
									<AdminAppointmentsDashboard />
								</HasPermission>
							</SW>
						}
					/>
					<Route
						path={"/dashboard/admin/appointments/:appointment_id"}
						element={
							<SW>
								<HasPermission
									id={VIEW_ALL_APPOINTMENTS}
									fallback={
										<ErrorPageFallback
											title="Permission Denied"
											message="You do not have permission to view this page."
										/>
									}
								>
									<AppointmentDetailPage />
								</HasPermission>
							</SW>
						}
					/>
					<Route
						path={"/dashboard/my/appointments"}
						element={
							<SW>
								<AppointmentsDashboard />
							</SW>
						}
					/>
					<Route
						path={"/dashboard/my/appointments/:appointment_id"}
						element={
							<SW>
								<MyAppointmentDetailPage />
							</SW>
						}
					/>
					<Route
						path={"/dashboard/my/patients"}
						element={
							<SW>
								<MyPatientsDashboard />
							</SW>
						}
					/>
					{/* Protected Routes End */}
				</Route>
			</Routes>
		</Router>
	);
}

/**
 * Suspense Wrapper
 */
const SW = ({children}: {children: React.ReactNode}) => {
	return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
};

const ProtectedRoute = ({redirectPath = "/"}) => {
	const context = useAuth();
	const location = useLocation();

	if (!context.user) {
		return <Navigate to={redirectPath} state={{redirectTo: location}} replace />;
	}

	return <Outlet />;
};

function NetworkError({error}: {error: ErrorType}) {
	return (
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
	);
}

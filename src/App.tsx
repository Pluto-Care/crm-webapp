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
import {ThemeProvider} from "@/components/theme-provider";
/* Components */
import Home from "@/pages/_index";
import {AuthProvider, useAuth} from "./contexts/auth";
import Dashboard from "./pages/dashboard/_index";

export default function App() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<AuthProvider>
				<Router>
					<Routes>
						<Route path={"/"} element={<Home />} />
						{/* Protected Routes Start */}
						<Route element={<ProtectedRoute />}>
							<Route path={"/dashboard"} element={<Dashboard />} />
						</Route>
						{/* Protected Routes End */}
					</Routes>
				</Router>
			</AuthProvider>
		</ThemeProvider>
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

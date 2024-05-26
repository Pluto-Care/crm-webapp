// Source:
// https://mobileledge.medium.com/usecontext-in-react-native-andbest-practices-1e899dc0f802

// react
import {API_URL as AUTH_BACKEND_URL} from "@/config";
import {ErrorType, handleAxiosError} from "@/lib/handleAxiosError";
import {AuthUserLastTokenSessionType, AuthUserLastWebSessionType, AuthUserType} from "@/types/auth";
import axios from "axios";
import {
	createContext,
	Dispatch,
	ReactElement,
	ReactNode,
	SetStateAction,
	useContext,
	useState,
	useCallback,
} from "react";

type AuthValueType = {
	detail: AuthUserType;
	last_web_session: AuthUserLastWebSessionType | null;
	last_token_session: AuthUserLastTokenSessionType | null;
};

type AuthContextType = {
	user: AuthValueType | null;
	setUser: Dispatch<SetStateAction<AuthValueType | null>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function useAuth(): AuthContextType {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

const AuthProvider = (props: {children: ReactNode}): ReactElement => {
	const [user, setUser] = useState<AuthContextType["user"]>(null);

	return <AuthContext.Provider {...props} value={{user, setUser}} />;
};

const SignedIn = (props: {children: ReactNode}): ReactElement => {
	const {user} = useAuth();
	return user ? <>{props.children}</> : <></>;
};

const SignedOut = (props: {children: ReactNode}): ReactElement => {
	const {user} = useAuth();
	return user ? <></> : <>{props.children}</>;
};

function useSignIn() {
	const {user, setUser} = useAuth();
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ErrorType | null>(null);

	const signIn = useCallback(
		async (email: string, password: string, token?: string) => {
			if (!email || !password) {
				throw new Error("Email and password are required");
			}
			if (user) {
				return user;
			}
			setLoading(true);
			setError(null);
			await axios
				.post(
					AUTH_BACKEND_URL + "/api/user/login/",
					{email: email, password: password, token: token},
					{
						headers: {
							"Content-Type": "application/json",
						},
						withCredentials: true,
					}
				)
				.then((response) => {
					// Set Context
					const value = {
						detail: response.data.user,
						last_web_session: response.data.last_session,
						last_token_session: response.data.last_token_session,
					};
					setUser(value);
					setLoading(false);
				})
				.catch((err) => {
					setLoading(false);
					handleAxiosError(err, setError);
					throw new Error(err);
				});
			return user;
		},
		[user, setError, setUser]
	);

	return {signIn, user, loading, error};
}

function useSignOut() {
	const {user, setUser} = useAuth();

	const signOut = async () => {
		if (!user) {
			throw new Error("User is already signed out");
		}
		await axios
			.post(
				AUTH_BACKEND_URL + "/api/user/logout/",
				{},
				{
					headers: {
						"Content-Type": "application/json",
					},
					withCredentials: true,
				}
			)
			.then(() => {
				setUser(null);
			})
			.catch((error) => {
				setUser(null);
				throw new Error(error);
			});
	};

	return {signOut};
}

function useRefresh() {
	const {user, setUser} = useAuth();

	/**
	 * If refresh fails, user is signed out
	 * @returns {boolean}
	 */
	const refresh = async () => {
		let success = false;
		await axios
			.get(AUTH_BACKEND_URL + "/api/user/me/", {
				headers: {
					"Content-Type": "application/json",
				},
				withCredentials: true,
			})
			.then((response) => {
				setUser({
					detail: response.data,
					last_web_session: user?.last_web_session || null,
					last_token_session: user?.last_token_session || null,
				});
				success = true;
			})
			.catch(() => {
				setUser(null);
			});
		return success;
	};

	return {refresh};
}

export {AuthProvider, useAuth, useSignIn, useSignOut, useRefresh, SignedIn, SignedOut};

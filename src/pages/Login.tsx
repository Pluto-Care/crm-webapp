import {z} from "zod";
import {UAParser} from "ua-parser-js";
import {Location, Navigate, useLocation, useNavigate} from "react-router-dom";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {QRCodeSVG} from "qrcode.react";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {AlertCircle, CircleX, Loader2} from "lucide-react";
import {SignedIn, SignedOut, useAuth, useSignIn} from "@/contexts/auth";
import {AuthUserLastTokenSessionType, AuthUserLastWebSessionType} from "@/types/auth";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {datePretty, timePretty, timeSince, weekDay} from "../lib/dateTimeUtils";
import {useCallback} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {mfaJoinAPI} from "@/services/api/mfa/initialize_totp";
import {mfaEnableAPI} from "@/services/api/mfa/enable_totp";

export default function LoginPage() {
	const location = useLocation();

	return (
		<>
			<div className="flex items-center justify-center min-h-screen">
				<LoginForm location={location} />
			</div>
		</>
	);
}

const loginFormSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1, {message: "This field cannot be empty"}).max(100),
});

const mfaTotpSchema = z.object({
	token: z.string().min(1, {message: "This field cannot be empty"}).max(20),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function LoginForm({location}: {location?: Location<any>}) {
	const navigate = useNavigate();
	const {signIn, user, loading, error, MFAJoinToken, mfaRequired} = useSignIn();

	// Page after login
	const redirectTo: string = location?.state?.redirectTo
		? location.state.redirectTo.pathname
		: "/dashboard";
	const nextPage = useCallback(() => {
		navigate(redirectTo, {
			replace: true,
		});
	}, [navigate, redirectTo]);

	// login form fields
	const form = useForm<z.infer<typeof loginFormSchema>>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	// form on submit
	async function onSubmit(values: z.infer<typeof loginFormSchema>) {
		await signIn(values.email, values.password);
	}

	const sendToken = async (token: string) => {
		await signIn(form.getValues("email"), form.getValues("password"), token);
	};

	return (
		<>
			<SignedOut>
				{mfaRequired ? (
					<>
						<EnterTotp error={error?.title} loading={loading} sendToken={sendToken} />
					</>
				) : MFAJoinToken ? (
					<>
						<JoinMFA mfa_join_token={MFAJoinToken} />
					</>
				) : (
					<div className="w-full max-w-md p-10 my-12 border rounded">
						<h2>Sign in to continue</h2>
						{location?.state?.redirectTo ? (
							<Alert className="mt-8">
								<AlertCircle className="w-4 h-4" />
								<AlertTitle>Authentication required to access</AlertTitle>
								<AlertDescription className="text-muted-foreground">
									<code>{location?.state?.redirectTo.pathname}</code>
								</AlertDescription>
							</Alert>
						) : (
							<></>
						)}
						<p className="text-muted-foreground">Enter your email and password below</p>
						<br />
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)}>
								<div className="space-y-4">
									{error && (
										<Alert variant="destructive">
											<AlertCircle className="w-4 h-4" />
											<AlertTitle>Error</AlertTitle>
											<AlertDescription>{error.title}</AlertDescription>
										</Alert>
									)}
									<FormField
										control={form.control}
										name="email"
										render={({field}) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input disabled={loading} placeholder="name@company.com" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="password"
										render={({field}) => (
											<FormItem>
												<FormLabel>Password</FormLabel>
												<FormControl>
													<Input disabled={loading} placeholder="" type="password" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="h-6"></div>
								<Button type="submit" disabled={loading}>
									{loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
									Continue
								</Button>
							</form>
						</Form>
						<br />
						<Button variant={"link"} size={"stripped"}>
							Forgot your password?
						</Button>
					</div>
				)}
			</SignedOut>
			<SignedIn>
				{user?.last_web_session || user?.last_web_session ? (
					<PreviousSessions
						lastWebSession={user.last_web_session}
						lastTokenSession={user.last_token_session}
						nextPage={nextPage}
					/>
				) : (
					<Navigate to={redirectTo} replace />
				)}
			</SignedIn>
		</>
	);
}

function JoinMFA({mfa_join_token}: {mfa_join_token: string}) {
	const join_query = useQuery({
		queryFn: () => mfaJoinAPI(mfa_join_token),
		queryKey: ["mfa_join", mfa_join_token],
		retry: 1,
		refetchOnWindowFocus: false,
	});

	// login form fields
	const form = useForm<z.infer<typeof mfaTotpSchema>>({
		resolver: zodResolver(mfaTotpSchema),
		defaultValues: {
			token: "",
		},
	});

	const mutation = useMutation({
		mutationFn: (totp_token: string) => mfaEnableAPI(mfa_join_token, totp_token),
		onSuccess: () => {
			// send to login form
		},
		onError: (err) => {
			console.log(err);
			// handleAxiosError(err.r, setError)
		},
	});

	// form on submit
	async function onSubmit(values: z.infer<typeof mfaTotpSchema>) {
		// mutation to enable MFA
		mutation.mutate(values.token);
	}

	return join_query.isSuccess ? (
		<>
			<div className="w-full max-w-lg p-10 my-12 border rounded">
				<h2>Setup Two-Factor Authentication</h2>
				{!mutation.isSuccess ? (
					<>
						<p className="text-muted-foreground">
							Scan the below QR code into Google Authenticator or your choice of authenticator app.
						</p>
						<br />
						<span className="inline-block p-2 border rounded">
							<QRCodeSVG value={join_query.data.provision} className="size-48 dark:invert" />
						</span>
						<p className="my-2">OR use the key below</p>
						<Input disabled className="text-foreground" type="text" value={join_query.data.key} />
						<p className="my-3">
							Save these backup codes somewhere safe for when you cannot access 2FA codes
						</p>
						<div className="grid grid-cols-3 p-3 mb-6 border rounded text-muted-foreground">
							{join_query.data.backup_codes.map((code) => (
								<div key={code} className="p-1">
									{code}{" "}
								</div>
							))}
						</div>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)}>
								<div className="space-y-4">
									{mutation.isError && (
										<Alert className="mt-6" variant="destructive">
											<AlertCircle className="w-4 h-4" />
											<AlertTitle>Error</AlertTitle>
											<AlertDescription>
												Some error has occurred. Try entering code again.
											</AlertDescription>
										</Alert>
									)}
									<FormField
										control={form.control}
										name="token"
										render={({field}) => (
											<FormItem className="mt-4">
												<FormLabel>6 Digit Code</FormLabel>
												<FormControl>
													<Input
														disabled={mutation.isPending}
														type="number"
														className="tracking-widest"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="h-6"></div>
								<Button type="submit" disabled={mutation.isPending}>
									{mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
									Continue
								</Button>
							</form>
						</Form>
					</>
				) : (
					<>
						<p className="my-4 text-muted-foreground">
							MFA setup is complete. Login again to use the application!
						</p>
						<Button
							onClick={() => {
								window.location.reload();
							}}
							className="w-full mt-6"
						>
							Login
						</Button>
					</>
				)}
			</div>
		</>
	) : join_query.isLoading ? (
		<div className="flex items-center justify-center min-h-screen">
			{/* This loader is shown when user is being fetched */}
			<Loader2 className="w-10 h-10 animate-spin" color={"#888888"} />
		</div>
	) : join_query.isError ? (
		<div className="w-full max-w-md my-12">
			<Alert className="w-full">
				<CircleX className="w-4 h-4 mt-1" />
				<AlertTitle className="text-base">Something went wrong</AlertTitle>
				<AlertDescription className="text-muted-foreground">
					Please reload this page.
				</AlertDescription>
				<Button
					onClick={() => {
						window.location.reload();
					}}
					className="w-full mt-6"
				>
					Reload
				</Button>
			</Alert>
		</div>
	) : (
		<></>
	);
}

function EnterTotp({
	error,
	loading,
	sendToken,
}: {
	error: string | undefined;
	loading: boolean;
	sendToken: (token: string) => void;
}) {
	// login form fields
	const form = useForm<z.infer<typeof mfaTotpSchema>>({
		resolver: zodResolver(mfaTotpSchema),
		defaultValues: {
			token: "",
		},
	});

	// form on submit
	async function onSubmit(values: z.infer<typeof mfaTotpSchema>) {
		// mutation to enable MFA
		sendToken(values.token);
	}

	return (
		<>
			<div className="w-full max-w-md p-10 my-12 border rounded">
				<h2>Enter Two-Factor Code</h2>
				<p className="my-4 text-muted-foreground">
					{" "}
					To continue, enter 6 digit 2FA code or one of your backup codes
				</p>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="space-y-4">
							{/* TODO: This is essentially a hack to show error message */}
							{error && !error.includes("required") && (
								<Alert className="mt-6" variant="destructive">
									<AlertCircle className="w-4 h-4" />
									<AlertTitle>Error</AlertTitle>
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}
							<FormField
								control={form.control}
								name="token"
								render={({field}) => (
									<FormItem>
										<FormLabel>Code</FormLabel>
										<FormControl>
											<Input
												disabled={loading}
												type="text"
												className="tracking-widest"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="h-6"></div>
						<Button type="submit" disabled={loading}>
							{loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
							Continue
						</Button>
					</form>
				</Form>
			</div>
		</>
	);
}

function PreviousSessions({
	lastWebSession,
	lastTokenSession,
	nextPage,
}: {
	lastWebSession: AuthUserLastWebSessionType | null;
	lastTokenSession: AuthUserLastTokenSessionType | null;
	nextPage: () => void;
}) {
	const context = useAuth();
	const ua_parser_web = new UAParser(lastWebSession?.ua);

	return (
		<div className="w-full max-w-lg p-10 my-12 border rounded">
			<h2>Welcome, {context.user?.detail.first_name}</h2>
			<p className="mb-5 text-muted-foreground">
				Do you remember these <span className="text-foreground">previous</span> logins?
			</p>
			{lastWebSession ? (
				<>
					<br />
					<h4>
						On Web{" "}
						<small className="ml-2 font-normal text-muted-foreground">
							({timeSince(lastWebSession.created_at)})
						</small>
					</h4>
					<div className="grid grid-cols-3 gap-1 mt-4">
						<div className="col-span-1 text-muted-foreground">
							<strong>Date:</strong>
						</div>
						<div className="flex justify-end col-span-2">
							{weekDay(lastWebSession.created_at)}, {datePretty(lastWebSession.created_at)}
						</div>
						<div className="col-span-1 text-muted-foreground">
							<strong>Time:</strong>
						</div>
						<div className="flex justify-end col-span-2">
							At {timePretty(lastWebSession.created_at)}
						</div>
						<div className="col-span-1 text-muted-foreground">
							<strong>IP Address:</strong>
						</div>
						<div className="flex justify-end col-span-2"> {lastWebSession?.ip}</div>
						<div className="col-span-1 text-muted-foreground">
							<strong>Browser:</strong>
						</div>
						<div className="flex justify-end col-span-2">
							{(ua_parser_web.getBrowser().name ?? "") +
								" " +
								(ua_parser_web.getBrowser().version ?? "")}
						</div>
						<div className="col-span-1 text-muted-foreground">
							<strong>OS:</strong>
						</div>
						<div className="flex justify-end col-span-2">
							{(ua_parser_web.getOS().name ?? "") + " " + (ua_parser_web.getOS().version ?? "")}
						</div>
					</div>
					<br />
				</>
			) : (
				<></>
			)}
			{lastTokenSession && lastWebSession ? <hr /> : <></>}
			{lastTokenSession ? (
				<>
					<br />
					<h4>
						On Mobile{" "}
						<small className="ml-2 font-normal text-muted-foreground">
							({timeSince(lastTokenSession.created_at)})
						</small>
					</h4>
					<div className="grid grid-cols-3 gap-1 mt-4">
						<div className="col-span-1 text-muted-foreground">
							<strong>Date:</strong>
						</div>
						<div className="flex justify-end col-span-2">
							{weekDay(lastTokenSession.created_at)}, {datePretty(lastTokenSession.created_at)}
						</div>
						<div className="col-span-1 text-muted-foreground">
							<strong>Time:</strong>
						</div>
						<div className="flex justify-end col-span-2">
							At {timePretty(lastTokenSession.created_at)}
						</div>
						<div className="col-span-1 text-muted-foreground">
							<strong>IP Address:</strong>
						</div>
						<div className="flex justify-end col-span-2"> {lastTokenSession?.ip}</div>
					</div>
					<br />
				</>
			) : (
				<></>
			)}
			<Alert className="my-4">
				<AlertCircle className="w-4 h-4" color={"#999999"} />
				<AlertTitle>See this information anytime</AlertTitle>
				<AlertDescription className="text-muted-foreground">
					Under <i>Settings &gt; Account Security</i>
				</AlertDescription>
			</Alert>
			<br />
			<Button className="w-full" onClick={nextPage}>
				Acknowledge
			</Button>
			<Button variant={"outline"} className="w-full mt-4">
				Report Suspicious Activity
			</Button>
		</div>
	);
}

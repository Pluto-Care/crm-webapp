import {z} from "zod";
import {UAParser} from "ua-parser-js";
import {Location, Navigate, useLocation, useNavigate} from "react-router-dom";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {QRCodeSVG} from "qrcode.react";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {AlertCircle, CheckIcon, CircleX, CircleXIcon, CopyIcon, Loader2} from "lucide-react";
import {SignedIn, SignedOut, useAuth, useSignIn} from "@/contexts/auth";
import {AuthUserLastTokenSessionType, AuthUserLastWebSessionType} from "@/types/auth";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {datePretty, timePretty, timeSince, weekDay} from "../../lib/dateTimeUtils";
import {useCallback, useState} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {mfaJoinAPI} from "@/services/api/mfa/initialize_totp";
import {mfaEnableAPI} from "@/services/api/mfa/enable_totp";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {AxiosError} from "axios";
import {ErrorType, handleAxiosError} from "@/lib/handleAxiosError";
import Logo from "@/assets/images/full-logo.svg";

export default function LoginPage() {
	const location = useLocation();

	return (
		<>
			<div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950">
				<div className="my-10">
					<img src={Logo} alt="Logo" className="h-10 dark:invert dark:brightness-75" />
				</div>
				<LoginForm location={location} />
				<div className="my-6 text-sm text-muted-foreground">
					Copyright {new Date().getFullYear()}. All rights reserved.
				</div>
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

	function parseErrorDetail(error: ErrorType) {
		{
			error?.errors.code === "InvalidTOTPToken" || error?.errors.code === "InvalidTOTPTokenTooLong"
				? (error?.errors.detail as string)
				: "Something went wrong";
		}
		if (error?.errors.code === "LoginSerializerErrors") {
			return error.errors.detail["non_field_errors"][0] as string;
		}
		return error.errors.title;
	}

	return (
		<>
			<SignedOut>
				{mfaRequired ? (
					<>
						<EnterTotp error={error} loading={loading} sendToken={sendToken} />
					</>
				) : MFAJoinToken ? (
					<>
						<JoinMFA mfa_join_token={MFAJoinToken} />
					</>
				) : (
					<Card className="w-full max-w-md">
						<CardHeader>
							<CardTitle>Sign in to continue</CardTitle>
							<CardDescription>Enter your email and password below</CardDescription>
						</CardHeader>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)}>
								<CardContent>
									{location?.state?.redirectTo ? (
										<Alert className="mb-4">
											<AlertCircle className="w-4 h-4" />
											<AlertTitle>Authentication required to access</AlertTitle>
											<AlertDescription className="text-muted-foreground">
												<code>{location?.state?.redirectTo.pathname}</code>
											</AlertDescription>
										</Alert>
									) : (
										<></>
									)}
									<div className="space-y-4">
										{error && (
											<Alert variant="destructive">
												<AlertCircle className="w-4 h-4" />
												<AlertTitle>Error</AlertTitle>
												<AlertDescription>{parseErrorDetail(error)}</AlertDescription>
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
								</CardContent>
								<CardFooter className="flex justify-between">
									<Button type="submit" disabled={loading}>
										{loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
										Continue
									</Button>
									<Button
										variant={"link"}
										size={"stripped"}
										type="button"
										onClick={() => {
											//TODO: Implement forgot password
										}}
									>
										Forgot your password?
									</Button>
								</CardFooter>
							</form>
						</Form>
					</Card>
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
	const [error, setError] = useState<ErrorType | null>(null);

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
		onError: (err: AxiosError) => {
			console.log(err);
			handleAxiosError(err, setError);
		},
	});

	// form on submit
	async function onSubmit(values: z.infer<typeof mfaTotpSchema>) {
		// mutation to enable MFA
		mutation.mutate(values.token);
	}

	return join_query.isSuccess ? (
		<>
			<Card className={(!mutation.isSuccess ? "max-w-3xl" : "max-w-lg") + " w-full"}>
				<CardHeader className="flex flex-row gap-8">
					<div className="flex-1">
						<CardTitle>Two-Factor Authentication</CardTitle>
						<CardDescription className="!mt-4 text-base leading-6">
							{!mutation.isSuccess ? (
								<>Scan the QR code in Google Authenticator or your choice of authenticator app.</>
							) : (
								<>MFA setup is complete. Login again to use the application!</>
							)}
						</CardDescription>
						{!mutation.isSuccess && (
							<>
								<div className="relative mt-10 mb-8">
									<div className="absolute inset-0 flex items-center">
										<span className="w-full border-t" />
									</div>
									<div className="relative flex justify-center text-xs uppercase">
										<span className="px-2 bg-background text-muted-foreground">
											OR use the key below
										</span>
									</div>
								</div>
								<div className="relative max-w-sm">
									<Input
										readOnly
										className="text-foreground"
										type="text"
										value={join_query.data.key}
									/>
									<Button
										className="absolute top-0 right-0 scale-95 border-0"
										variant={"outline"}
										onClick={(e) => {
											navigator.clipboard.writeText(join_query.data.key);
											e.currentTarget.children[0].classList.add("hidden");
											e.currentTarget.children[1].classList.remove("hidden");
										}}
									>
										<CopyIcon className="w-4 h-4" />
										<CheckIcon className="hidden w-4 h-4" />
									</Button>
								</div>
							</>
						)}
					</div>
					{!mutation.isSuccess && (
						<div>
							<span className="inline-block p-2 border rounded">
								<QRCodeSVG value={join_query.data.provision} className="size-48 dark:invert" />
							</span>
						</div>
					)}
				</CardHeader>
				<CardContent>
					{!mutation.isSuccess ? (
						<>
							<h6 className="my-2 font-medium">Backup Codes</h6>
							<p className="!mt-0 mb-2 leading-6 text-muted-foreground">
								Save these backup codes somewhere safe for when you cannot access 2FA codes
							</p>
							<div className="grid grid-cols-6 px-3 py-2 mb-6 border rounded text-muted-foreground">
								{join_query.data.backup_codes.map((code) => (
									<div key={code} className="p-1 font-mono text-sm">
										{code}{" "}
									</div>
								))}
							</div>
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)}>
									<div className="space-y-4">
										{mutation.isError && (
											<Alert className="mt-6" variant="destructive">
												<CircleXIcon className="w-4 h-4" />
												<AlertTitle>{error?.errors.title ?? "Error"}</AlertTitle>
												<AlertDescription>
													{error?.errors.code === "InvalidTOTPToken" ||
													error?.errors.code === "InvalidTOTPTokenTooLong"
														? (error?.errors.detail as string)
														: "Something went wrong"}
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
															className="tracking-[0.5em] max-w-64"
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
				</CardContent>
			</Card>
		</>
	) : join_query.isLoading ? (
		<div className="flex items-center justify-center min-h-screen">
			{/* This loader is shown when user is being fetched */}
			<Loader2 className="w-10 h-10 animate-spin" color={"#888888"} />
		</div>
	) : join_query.isError ? (
		<div className="w-full max-w-md">
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
	error: ErrorType | null;
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
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Enter Two-Factor Code</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="mb-4 -mt-2 leading-6 text-muted-foreground">
						To continue, enter 6 digit 2FA code or one of your backup codes
					</p>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<div className="space-y-4">
								{error && error.errors.code === "TOTPIncorrect" && (
									<Alert className="mt-6" variant="destructive">
										<AlertCircle className="w-4 h-4" />
										<AlertTitle>Error</AlertTitle>
										<AlertDescription>{error.errors.detail as string}</AlertDescription>
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
													className="tracking-[0.5em] max-w-64"
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
				</CardContent>
			</Card>
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
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>Welcome, {context.user?.detail.first_name}</CardTitle>
				<CardDescription>Do you remember these previous logins?</CardDescription>
			</CardHeader>
			<CardContent>
				{lastWebSession ? (
					<div className="mb-4">
						<h5>
							On Web{" "}
							<small className="ml-2 font-normal text-muted-foreground">
								({timeSince(lastWebSession.created_at)})
							</small>
						</h5>
						<div className="grid grid-cols-3 gap-1 mt-3">
							<div className="col-span-1 text-muted-foreground">Date:</div>
							<div className="flex justify-end col-span-2">
								{weekDay(lastWebSession.created_at)}, {datePretty(lastWebSession.created_at)}
							</div>
							<div className="col-span-1 text-muted-foreground">Time:</div>
							<div className="flex justify-end col-span-2">
								At {timePretty(lastWebSession.created_at)}
							</div>
							<div className="col-span-1 text-muted-foreground">IP Address:</div>
							<div className="flex justify-end col-span-2"> {lastWebSession?.ip}</div>
							<div className="col-span-1 text-muted-foreground">Browser:</div>
							<div className="flex justify-end col-span-2">
								{(ua_parser_web.getBrowser().name ?? "") +
									" " +
									(ua_parser_web.getBrowser().version ?? "")}
							</div>
							<div className="col-span-1 text-muted-foreground">OS:</div>
							<div className="flex justify-end col-span-2">
								{(ua_parser_web.getOS().name ?? "") + " " + (ua_parser_web.getOS().version ?? "")}
							</div>
						</div>
					</div>
				) : (
					<></>
				)}
				{lastTokenSession && lastWebSession ? <hr /> : <></>}
				{lastTokenSession ? (
					<div className="my-4">
						<h5>
							On Mobile{" "}
							<small className="ml-2 font-normal text-muted-foreground">
								({timeSince(lastTokenSession.created_at)})
							</small>
						</h5>
						<div className="grid grid-cols-3 gap-1 mt-3">
							<div className="col-span-1 text-muted-foreground">Date:</div>
							<div className="flex justify-end col-span-2">
								{weekDay(lastTokenSession.created_at)}, {datePretty(lastTokenSession.created_at)}
							</div>
							<div className="col-span-1 text-muted-foreground">Time:</div>
							<div className="flex justify-end col-span-2">
								At {timePretty(lastTokenSession.created_at)}
							</div>
							<div className="col-span-1 text-muted-foreground">IP Address:</div>
							<div className="flex justify-end col-span-2"> {lastTokenSession?.ip}</div>
						</div>
						<br />
					</div>
				) : (
					<></>
				)}
				<Alert className="mt-4">
					<AlertCircle className="w-4 h-4" color={"#999999"} />
					<AlertTitle>See this information anytime</AlertTitle>
					<AlertDescription className="text-muted-foreground">
						Under <i>Settings &gt; Account Security</i>
					</AlertDescription>
				</Alert>
			</CardContent>
			<CardFooter className="flex flex-col">
				<Button className="w-full" onClick={nextPage}>
					Acknowledge
				</Button>
				<Button variant={"outline"} className="w-full mt-3">
					Report Suspicious Activity
				</Button>
			</CardFooter>
		</Card>
	);
}

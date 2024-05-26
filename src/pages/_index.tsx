import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {AlertCircle, Loader2} from "lucide-react";
import {SignedIn, SignedOut, useAuth, useSignIn} from "@/contexts/auth";
import {AuthUserLastTokenSessionType, AuthUserLastWebSessionType} from "@/types/auth";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {UAParser} from "ua-parser-js";
import {datePretty, timePretty, timeSince, weekDay} from "../lib/dateTimeUtils";
import {Location, Navigate, useLocation, useNavigate} from "react-router-dom";
import {useCallback} from "react";

export default function Home() {
	const location = useLocation();

	return (
		<>
			<div className="flex items-center justify-center min-h-screen">
				<LoginForm location={location} />
			</div>
		</>
	);
}

const formSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1, {message: "This field cannot be empty"}).max(100),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function LoginForm({location}: {location?: Location<any>}) {
	const navigate = useNavigate();
	const {signIn, user, loading, error} = useSignIn();

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
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	// form on submit
	async function onSubmit(values: z.infer<typeof formSchema>) {
		await signIn(values.email, values.password);
	}

	return (
		<>
			<SignedOut>
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

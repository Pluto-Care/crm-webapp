import {z} from "zod";
import {Link, useLocation} from "react-router-dom";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {AlertCircle, ArrowLeft, Loader2} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {useMutation} from "@tanstack/react-query";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Logo from "@/assets/images/full-logo.svg";
import {resetPasswordAPI} from "@/services/api/password_reset_completion";
import {AxiosTqError, ErrorType} from "@/lib/handleAxiosError";
import {useState} from "react";

export default function ResetPasswordCompletionPage() {
	const location = useLocation();
	const token = new URLSearchParams(location.search).get("token");

	if (!token || token === "") {
		return (
			<div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950">
				<div>
					<div className="my-10">
						<img src={Logo} alt="Logo" className="h-10 dark:invert dark:brightness-75" />
					</div>
					<div className="my-6 text-sm text-muted-foreground">
						Invalid reset token. Please try reseting your password again.
					</div>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950">
				<div className="my-10">
					<img src={Logo} alt="Logo" className="h-10 dark:invert dark:brightness-75" />
				</div>
				<ResetForm token={token} />
				<div className="my-6 text-sm text-muted-foreground">
					Copyright {new Date().getFullYear()}. All rights reserved.
				</div>
			</div>
		</>
	);
}

function parseErrorDetail(error: ErrorType) {
	if (error?.errors.code === "HealthCheckFailed") {
		return error.errors.detail["non_field_errors"][0] as string;
	}
	return error.errors.title;
}

const passwordResetSchema = z.object({
	password: z.string().min(1, {message: "This field cannot be empty"}).max(100),
	confirm_password: z.string().min(1, {message: "This field cannot be empty"}).max(100),
	key: z.string().min(1, {message: "This field cannot be empty"}),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ResetForm({token}: {token: string}) {
	const [error, setError] = useState<string | null>(null);
	const mutation = useMutation({
		mutationKey: ["resetPasswordComplete"],
		mutationFn: (data: z.infer<typeof passwordResetSchema>) =>
			resetPasswordAPI(data.password, data.key),
		onError: (error: AxiosTqError) => {
			setError(parseErrorDetail(error.response?.data as ErrorType));
		},
	});

	// login form fields
	const form = useForm<z.infer<typeof passwordResetSchema>>({
		resolver: zodResolver(passwordResetSchema),
		defaultValues: {
			password: "",
			confirm_password: "",
			key: token,
		},
	});

	return mutation.isSuccess ? (
		<>
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Reset Complete!</CardTitle>
				</CardHeader>
				<CardContent>
					<p>Password has been reset.</p>
					<br />
					<Link to="/login" className="flex items-center text-sm underline text-primary">
						<ArrowLeft className="w-4 h-4 mr-2" />
						<span>Back to login</span>
					</Link>
				</CardContent>
			</Card>
		</>
	) : (
		<>
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Reset Password</CardTitle>
					<CardDescription>Enter password below to complete the reset.</CardDescription>
				</CardHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit((values: z.infer<typeof passwordResetSchema>) => {
							console.log(values);
							mutation.mutate(values);
						})}
					>
						<CardContent>
							<div className="space-y-4">
								{mutation.isError && error && (
									<Alert variant="destructive">
										<AlertCircle className="w-4 h-4" />
										<AlertTitle>Error</AlertTitle>
										<AlertDescription>{error}</AlertDescription>
									</Alert>
								)}
								<FormField
									control={form.control}
									name="password"
									render={({field}) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input disabled={mutation.isPending} type="password" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="confirm_password"
									render={({field}) => (
										<FormItem>
											<FormLabel>Type password again</FormLabel>
											<FormControl>
												<Input disabled={mutation.isPending} type="password" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</CardContent>
						<CardFooter className="flex justify-between">
							<Button type="submit" disabled={mutation.isPending}>
								{mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
								Reset Password
							</Button>
						</CardFooter>
						<CardContent>
							<Link to="/login" className="flex items-center text-sm underline text-primary">
								<ArrowLeft className="w-4 h-4 mr-2" />
								<span>Back to login</span>
							</Link>
						</CardContent>
					</form>
				</Form>
			</Card>
		</>
	);
}

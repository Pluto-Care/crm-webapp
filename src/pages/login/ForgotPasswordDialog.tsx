import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useMutation} from "@tanstack/react-query";
import {CheckCircle, Loader2} from "lucide-react";
import * as React from "react";
import {forgotPasswordRequestAPI} from "@/services/api/forgot_password_request";

const forgotPasswordSchema = z.object({
	email: z.string().email("Invalid email address"),
});

interface Props {
	children: React.ReactNode;
	self?: boolean;
}

export default function ForgotPasswordDialog(props: Props) {
	const form = useForm<z.infer<typeof forgotPasswordSchema>>({
		resolver: zodResolver(forgotPasswordSchema),
	});

	//mutation
	const mutation = useMutation({
		mutationKey: ["forgotPassword"],
		mutationFn: (data: z.infer<typeof forgotPasswordSchema>) =>
			forgotPasswordRequestAPI(data.email),
		onSuccess: () => {
			// Invalidate org profile get request
		},
	});

	const onSubmit = (data: z.infer<typeof forgotPasswordSchema>) => {
		mutation.mutate(data);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{props.children}</DialogTrigger>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle className="text-2xl">Forgot Password</DialogTitle>
					{!mutation.isSuccess && (
						<DialogDescription>
							Enter your email address and reset details will be sent to your mailbox.
						</DialogDescription>
					)}
				</DialogHeader>
				<div className="mt-2">
					{mutation.isError && (
						<div className="p-4 mb-4 text-red-600 bg-red-100 border border-red-300 rounded">
							{mutation.error.message}
						</div>
					)}
					{mutation.isSuccess ? (
						<>
							<div className="flex gap-4 mb-1">
								<CheckCircle className="w-10 h-10 text-green-500" />
								<span>
									Password reset requested successfully. Check your email for further instructions.
								</span>
							</div>
							<Button variant={"link"} className="mt-2 !p-0" onClick={() => mutation.reset()}>
								Wrong email address?
							</Button>
						</>
					) : (
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)}>
								<div className="mb-6">
									<FormField
										control={form.control}
										name="email"
										render={({field}) => (
											<FormItem>
												<FormLabel>
													Email <span className="text-base leading-4 text-destructive">*</span>
												</FormLabel>
												<FormControl>
													<Input placeholder="you@company.com" {...field} />
												</FormControl>
												{form.formState.errors.email && <FormMessage />}
											</FormItem>
										)}
									/>
								</div>
								<DialogFooter>
									<Button type="submit" disabled={mutation.isPending}>
										{mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
										Continue Password Reset
									</Button>
								</DialogFooter>
							</form>
						</Form>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useMutation} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";
import {Loader2} from "lucide-react";
import {createUserAPI} from "@/services/api/organization/admin/create_user";

const addUserSchema = z.object({
	email: z.string().email(),
	first_name: z.string(),
	last_name: z.string(),
	password: z.string().min(8),
	confirm_password: z.string().min(8),
});

export default function AddUserForm(props: {children: React.ReactNode}) {
	const navigate = useNavigate();
	const form = useForm<z.infer<typeof addUserSchema>>({
		resolver: zodResolver(addUserSchema),
	});

	//mutation
	const mutation = useMutation({
		mutationKey: ["addUser"],
		mutationFn: (data: z.infer<typeof addUserSchema>) => createUserAPI(data),
		onSuccess: (data) => {
			navigate("/dashboard/admin/users/" + data.id);
		},
	});

	const onSubmit = (data: z.infer<typeof addUserSchema>) => {
		if (data.password !== data.confirm_password) {
			form.setError("confirm_password", {
				message: "Passwords do not match",
			});
			return;
		}
		mutation.mutate(data);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{props.children}</DialogTrigger>
			<DialogContent className="w-full sm:max-w-lg">
				<div className="">
					<DialogHeader>
						<DialogTitle className="text-2xl">Add User</DialogTitle>
						<DialogDescription>
							Fill in the details below to add a new user to your organization. Users created here
							will be able to log into this portal and mobile application.
						</DialogDescription>
					</DialogHeader>
					{mutation.isError && (
						<div className="p-4 mb-4 text-red-600 bg-red-100 border border-red-300 rounded">
							{mutation.error.message}
						</div>
					)}
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<div className="my-8 space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="first_name"
										render={({field}) => (
											<FormItem>
												<FormLabel>First name</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="last_name"
										render={({field}) => (
											<FormItem>
												<FormLabel>Last name</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<FormField
									control={form.control}
									name="email"
									render={({field}) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input {...field} />
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
												<Input type="password" {...field} />
											</FormControl>
											<FormDescription>
												Password must be at least 8 characters long, and contain at least one
												uppercase letter, one lowercase letter, one number, and one special
												character.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="confirm_password"
									render={({field}) => (
										<FormItem>
											<FormLabel>Confirm Password</FormLabel>
											<FormControl>
												<Input type="password" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<DialogFooter>
								<Button type="submit" disabled={mutation.isPending}>
									{mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
									Continue
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	);
}

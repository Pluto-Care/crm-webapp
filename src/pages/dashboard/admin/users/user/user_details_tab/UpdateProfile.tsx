import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Loader2} from "lucide-react";
import {ErrorMessageAlert} from "@/components/utils/ErrorMessageAlert";
import {AxiosTqError} from "@/lib/handleAxiosError";
import {UserType} from "@/types/user";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	updateUserProfileByAdminAPI,
	UpdateUserProfileSchema,
} from "@/services/api/organization/admin/update_user_profile";
import {zodResolver} from "@hookform/resolvers/zod";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";
import {DialogDescription} from "@radix-ui/react-dialog";

const schema = z.object({
	email: z.string().email("Email is invalid"),
	timezone: z.string().min(1),
	is_active: z.boolean(),
	first_name: z.string().min(1, "First name is required"),
	last_name: z.string().min(1, "Last name is required"),
});

const tzList = Intl.supportedValuesOf("timeZone");

export default function UpdateProfile({
	user,
	children,
}: {
	user: UserType;
	children: React.ReactNode;
}) {
	const queryClient = useQueryClient();
	const [error, setError] = useState<string | null>(null);
	const form = useForm<z.infer<typeof schema>>({
		defaultValues: {
			email: user.email,
			timezone: user.timezone,
			is_active: user.is_active,
			first_name: user.first_name,
			last_name: user.last_name,
		},
		resolver: zodResolver(schema),
	});

	const onSubmit = (data: z.infer<typeof schema>) => {
		mutation.mutate(data);
	};

	console.log("update");

	const mutation = useMutation({
		mutationKey: ["update_profile" + user.id],
		mutationFn: (data: UpdateUserProfileSchema) => updateUserProfileByAdminAPI(user.id, data),
		onError: (error: AxiosTqError) => {
			const data = error.response?.data;
			// Based on how the API is designed, we can handle the error here
			if ("errors" in data && "code" in data.errors) {
				const code: string = data.errors.code;
				if (code === "UserProfileUpdateInvalid") {
					setError(JSON.stringify(data.errors.detail));
				} else {
					setError(
						data.errors.title +
							" (" +
							JSON.stringify(data.errors.detail) +
							")" +
							" [Code: " +
							code +
							"]"
					);
				}
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["user_detail", user.id],
			});
		},
	});

	return (
		<Dialog
			onOpenChange={(open) => {
				if (!open) {
					form.reset();
					mutation.reset();
					setError(null);
				}
			}}
		>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="w-full sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="text-2xl">Update Profile</DialogTitle>
				</DialogHeader>
				<DialogDescription className="!mt-0 text-[90%] leading-6 text-muted-foreground">
					Changes made here take effect immediately. User may need to reload the page or application
					to see changes.
				</DialogDescription>
				{mutation.isSuccess ? (
					<div className="space-y-4">
						<p className="text-[95%] font-medium leading-6 text-green-700 rounded-md dark:text-green-500 dark:bg-transparent">
							Profile has been updated successfully.
						</p>
						<Button
							variant="secondary"
							onClick={() => {
								mutation.reset();
							}}
						>
							Edit Again
						</Button>
					</div>
				) : (
					<>
						{mutation.isError && (
							<div className="mt-2">
								<ErrorMessageAlert message={error || ""} title="Error" size="sm" />
							</div>
						)}
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<div className="mt-2 mb-4 space-y-5">
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-1">
										<Label
											htmlFor="first_name"
											className={form.formState.errors.first_name ? "text-destructive" : ""}
										>
											First name <span className="text-base leading-4 text-destructive">*</span>
										</Label>
										<Input id="first_name" {...form.register("first_name")} />
										{form.formState.errors.first_name && (
											<div className="text-sm text-destructive">
												{form.formState.errors.first_name.message}
											</div>
										)}
									</div>
									<div className="space-y-1">
										<Label
											htmlFor="last_name"
											className={form.formState.errors.last_name ? "text-destructive" : ""}
										>
											Last name <span className="text-base leading-4 text-destructive">*</span>
										</Label>
										<Input id="last_name" {...form.register("last_name")} />
										{form.formState.errors.last_name && (
											<div className="text-sm text-destructive">
												{form.formState.errors.last_name.message}
											</div>
										)}
									</div>
								</div>
								<div className="space-y-1">
									<Label
										htmlFor="email"
										className={form.formState.errors.email ? "text-destructive" : ""}
									>
										Email Address <span className="text-base leading-4 text-destructive">*</span>
									</Label>
									<Input id="email" {...form.register("email")} />
									{form.formState.errors.email && (
										<div className="text-sm text-destructive">
											{form.formState.errors.email.message}
										</div>
									)}
									<div className="text-sm text-muted-foreground">
										Changing will require user to use new email address to login. Current sessions
										are not affected.
									</div>
								</div>
								<div className="space-y-1">
									<Label className={form.formState.errors.timezone ? "text-destructive" : ""}>
										Timezone <span className="text-base leading-4 text-destructive">*</span>
									</Label>
									<Select
										onValueChange={(value) => {
											form.setValue("timezone", value);
										}}
										defaultValue={form.getValues("timezone")}
									>
										<SelectTrigger>
											<SelectValue placeholder={user.timezone} />
										</SelectTrigger>
										<SelectContent>
											{tzList.map((tz, index) => (
												<SelectItem key={index} value={tz}>
													{tz}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{form.formState.errors.timezone && (
										<div className="text-sm text-destructive">
											{form.formState.errors.timezone.message}
										</div>
									)}
									<div className="text-sm text-muted-foreground">
										User&apos;s local timezone. This will affect how dates and times are displayed.
									</div>
								</div>
								<div className="space-y-1">
									<div className="flex items-center space-x-2">
										<Checkbox
											id="active"
											defaultChecked={form.getValues("is_active")}
											onCheckedChange={(value) => {
												form.setValue("is_active", value.valueOf() as boolean);
											}}
										/>
										<label
											htmlFor="active"
											className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
										>
											Active
										</label>
									</div>
								</div>
							</div>
							<DialogFooter>
								<Button type="submit" disabled={mutation.isPending}>
									{mutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
									<span>Update profile</span>
								</Button>
							</DialogFooter>
						</form>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}

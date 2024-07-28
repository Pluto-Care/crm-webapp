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
import {Loader2} from "lucide-react";
import * as React from "react";
import {
	updateOrgProfileAPI,
	UpdateOrgProfileAPIType,
} from "@/services/api/organization/update_org_profile";
import {useAuth} from "@/contexts/auth";

const updateOrgProfileSchema = z.object({
	name: z.string().min(3, "Name is too short"),
	phone: z.string().min(10, "Phone number is too short"),
	email: z.string().email("Invalid email address"),
	street: z.string(),
	city: z.string(),
	state: z.string(),
	country: z.string(),
	postal_code: z.string(),
});

interface Props {
	children: React.ReactNode;
	self?: boolean;
}

export default function UpdateOrgProfileDialog(props: Props) {
	const auth_context = useAuth();
	const form = useForm<z.infer<typeof updateOrgProfileSchema>>({
		resolver: zodResolver(updateOrgProfileSchema),
		defaultValues: {
			name: auth_context?.org?.name,
			phone: auth_context?.org?.phone,
			email: auth_context?.org?.email,
			street: auth_context?.org?.street,
			city: auth_context?.org?.city,
			state: auth_context?.org?.state,
			country: auth_context?.org?.country,
			postal_code: auth_context?.org?.postal_code,
		},
	});

	//mutation
	const mutation = useMutation({
		mutationKey: ["updateOrgProfile"],
		mutationFn: (data: UpdateOrgProfileAPIType) => updateOrgProfileAPI(data),
		onSuccess: () => {
			// Invalidate org profile get request
		},
	});

	const onSubmit = (data: z.infer<typeof updateOrgProfileSchema>) => {
		mutation.mutate(data);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{props.children}</DialogTrigger>
			<DialogContent className="min-w-[55rem]">
				<DialogHeader>
					<DialogTitle className="text-2xl">Update Organization Profile</DialogTitle>
					<DialogDescription>Fill in the details to update your organization.</DialogDescription>
				</DialogHeader>
				<div className="mt-2">
					{mutation.isError && (
						<div className="p-4 mb-4 text-red-600 bg-red-100 border border-red-300 rounded">
							{mutation.error.message}
						</div>
					)}
					{mutation.isSuccess ? (
						<>
							<div className="p-4 mb-4 text-green-600 bg-green-100 border border-green-300 rounded">
								Organization updated successfully
							</div>
						</>
					) : (
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)}>
								<div className="grid grid-cols-3 gap-8 mb-4">
									<FormField
										control={form.control}
										name="name"
										render={({field}) => (
											<FormItem>
												<FormLabel>
													Name <span className="text-base leading-4 text-destructive">*</span>
												</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												{form.formState.errors.name && <FormMessage />}
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="phone"
										render={({field}) => (
											<FormItem>
												<FormLabel>
													Phone (+1) <span className="text-base leading-4 text-destructive">*</span>
												</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												{form.formState.errors.phone && <FormMessage />}
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="email"
										render={({field}) => (
											<FormItem>
												<FormLabel>
													Email <span className="text-base leading-4 text-destructive">*</span>
												</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												{form.formState.errors.email && <FormMessage />}
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="street"
										render={({field}) => (
											<FormItem>
												<FormLabel>
													Street Address{" "}
													<span className="text-base leading-4 text-destructive">*</span>
												</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												{form.formState.errors.street && <FormMessage />}
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="city"
										render={({field}) => (
											<FormItem>
												<FormLabel>
													City <span className="text-base leading-4 text-destructive">*</span>
												</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												{form.formState.errors.city && <FormMessage />}
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="state"
										render={({field}) => (
											<FormItem>
												<FormLabel>
													Province/State{" "}
													<span className="text-base leading-4 text-destructive">*</span>
												</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												{form.formState.errors.state && <FormMessage />}
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="country"
										render={({field}) => (
											<FormItem>
												<FormLabel>
													Country <span className="text-base leading-4 text-destructive">*</span>
												</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												{form.formState.errors.country && <FormMessage />}
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="postal_code"
										render={({field}) => (
											<FormItem>
												<FormLabel>
													Postal/Zip Code{" "}
													<span className="text-base leading-4 text-destructive">*</span>
												</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												{form.formState.errors.postal_code && <FormMessage />}
											</FormItem>
										)}
									/>
								</div>
								<DialogFooter>
									<Button type="submit" disabled={mutation.isPending}>
										{mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
										Update Organization
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

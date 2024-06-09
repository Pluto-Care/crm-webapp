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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {monthPretty} from "@/lib/dateTimeUtils";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useMutation} from "@tanstack/react-query";
import {createPatientAPI} from "@/services/api/patients/create";
import {useNavigate} from "react-router-dom";
import {Loader2} from "lucide-react";
import {format} from "date-fns";
import {PatientType} from "@/types/patient";

const addPatientSchema = z.object({
	email: z.string().email(),
	first_name: z.string(),
	last_name: z.string(),
	phone: z.coerce.number().gte(1000000000).lte(9999999999),
	dob_day: z.coerce.number().gte(1).lte(31),
	dob_month: z.coerce.number().gte(1).lte(12),
	dob_year: z.coerce.number().gte(1900).lte(new Date().getFullYear()),
	street: z.string(),
	city: z.string(),
	country: z.string(),
	state: z.string(),
	postal_code: z.string(),
});

export default function AddPatientForm(props: {children: React.ReactNode}) {
	const navigate = useNavigate();
	const form = useForm<z.infer<typeof addPatientSchema>>({
		resolver: zodResolver(addPatientSchema),
		defaultValues: {
			country: "Canada",
			state: "British Columbia",
		},
	});
	const watch_country: string = form.watch("country", "Canada");

	//mutation
	const mutation = useMutation({
		mutationKey: ["addPatient"],
		mutationFn: (data: unknown) => createPatientAPI(data as PatientType),
		onSuccess: (data) => {
			navigate("/dashboard/admin/patients/" + data.data.id);
		},
	});

	const onSubmit = (data: z.infer<typeof addPatientSchema>) => {
		// convert dob to ISO string
		const dob = format(new Date(data.dob_year, data.dob_month - 1, data.dob_day), "yyyy-MM-dd");
		const patient = {
			...data,
			dob,
		};
		mutation.mutate(patient);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{props.children}</DialogTrigger>
			<DialogContent className="w-full h-full min-w-full">
				<div className="container relative mx-auto overflow-y-scroll">
					<DialogHeader>
						<DialogTitle className="text-2xl">Add New Patient</DialogTitle>
						<DialogDescription>Fill in the details below to add a new patient.</DialogDescription>
					</DialogHeader>
					<div className="max-w-5xl py-8 mx-auto mt-8">
						{mutation.isError && (
							<div className="p-4 mb-4 text-red-600 bg-red-100 border border-red-300 rounded">
								{mutation.error.message}
							</div>
						)}
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)}>
								<DialogDescription className="px-4 py-2 mb-6 text-base font-medium bg-muted text-foreground">
									Patient Information
								</DialogDescription>
								<div className="grid grid-cols-2 gap-4 mb-12">
									<FormField
										control={form.control}
										name="first_name"
										render={({field}) => (
											<FormItem className="grid items-center w-full grid-cols-4 gap-4 space-y-0">
												<FormLabel className="text-right">First name</FormLabel>
												<FormControl className="col-span-3">
													<Input {...field} />
												</FormControl>
												{form.formState.errors.first_name && (
													<>
														<div></div>
														<div className="w-full col-span-3">
															<FormMessage />
														</div>
													</>
												)}
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="last_name"
										render={({field}) => (
											<FormItem className="grid items-center w-full grid-cols-4 gap-4 space-y-0">
												<FormLabel className="text-right">Last name</FormLabel>
												<FormControl className="col-span-3">
													<Input {...field} />
												</FormControl>
												{form.formState.errors.last_name && (
													<>
														<div></div>
														<div className="w-full col-span-3">
															<FormMessage />
														</div>
													</>
												)}
											</FormItem>
										)}
									/>
									<div className="grid items-center w-full grid-cols-4 gap-4 space-y-0">
										<Label
											className={
												(form.formState.errors.dob_month ||
												form.formState.errors.dob_day ||
												form.formState.errors.dob_year
													? "text-red-600 dark:text-red-500 "
													: "") + "text-right"
											}
										>
											Date of birth
										</Label>
										<div className="flex justify-between w-full col-span-3 gap-4">
											<FormField
												control={form.control}
												name="dob_day"
												render={({field}) => (
													<FormItem className="w-full">
														<Select
															onValueChange={field.onChange}
															defaultValue={(field.value ?? "").toString()}
														>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder="Day" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																{[...Array(31)].map((_, index) => (
																	<SelectItem key={index} value={(index + 1).toString()}>
																		{index + 1}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
														{form.formState.errors.dob_day && (
															<>
																<div></div>
																<div className="w-full col-span-3">
																	<FormMessage />
																</div>
															</>
														)}{" "}
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="dob_month"
												render={({field}) => (
													<FormItem className="w-full">
														<Select
															onValueChange={field.onChange}
															defaultValue={(field.value ?? "").toString()}
														>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder="Month" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																{[...Array(12)].map((_, index) => (
																	<SelectItem key={index} value={(index + 1).toString()}>
																		{monthPretty(index)}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
														{form.formState.errors.dob_month && (
															<>
																<div></div>
																<div className="w-full col-span-3">
																	<FormMessage />
																</div>
															</>
														)}
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="dob_year"
												render={({field}) => (
													<FormItem className="w-full">
														<Select
															onValueChange={field.onChange}
															defaultValue={(field.value ?? "").toString()}
														>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder="Year" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																{[...Array(100)].map((_, index) => (
																	<SelectItem
																		key={index}
																		className="font-mono"
																		value={(new Date().getFullYear() - index).toString()}
																	>
																		{new Date().getFullYear() - index}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
														{form.formState.errors.dob_year && (
															<>
																<div></div>
																<div className="w-full col-span-3">
																	<FormMessage />
																</div>
															</>
														)}
													</FormItem>
												)}
											/>
										</div>
									</div>
								</div>
								<DialogDescription className="px-4 py-2 mb-6 text-base font-medium bg-muted text-foreground">
									Contact Information
								</DialogDescription>
								<div className="grid grid-cols-2 gap-4 mb-12">
									<FormField
										control={form.control}
										name="phone"
										render={({field}) => (
											<FormItem className="grid items-center w-full grid-cols-4 gap-4 space-y-0">
												<FormLabel className="text-right">Phone</FormLabel>
												<div className="flex items-center col-span-3 gap-2">
													<Label className="block h-full px-2 py-3 rounded min-w-[7.5rem] bg-muted border">
														+1 (Canada/US)
													</Label>
													<FormControl>
														<Input {...field} type="number" />
													</FormControl>
												</div>
												{form.formState.errors.phone && (
													<>
														<div></div>
														<div className="w-full col-span-3">
															<FormMessage />
														</div>
													</>
												)}
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="email"
										render={({field}) => (
											<FormItem className="grid items-center w-full grid-cols-4 gap-4 space-y-0">
												<FormLabel className="text-right">Email</FormLabel>
												<FormControl className="col-span-3">
													<Input {...field} />
												</FormControl>
												{form.formState.errors.email && (
													<>
														<div></div>
														<div className="w-full col-span-3">
															<FormMessage />
														</div>
													</>
												)}
											</FormItem>
										)}
									/>
								</div>
								<DialogDescription className="px-4 py-2 mb-6 text-base font-medium bg-muted text-foreground">
									Address Information
								</DialogDescription>
								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="street"
										render={({field}) => (
											<FormItem className="grid items-center w-full grid-cols-4 gap-4 space-y-0">
												<FormLabel className="text-right">Street Address</FormLabel>
												<FormControl className="col-span-3">
													<Input {...field} />
												</FormControl>
												{form.formState.errors.street && (
													<>
														<div></div>
														<div className="w-full col-span-3">
															<FormMessage />
														</div>
													</>
												)}
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="city"
										render={({field}) => (
											<FormItem className="grid items-center w-full grid-cols-4 gap-4 space-y-0">
												<FormLabel className="text-right">City</FormLabel>
												<FormControl className="col-span-3">
													<Input {...field} />
												</FormControl>
												{form.formState.errors.city && (
													<>
														<div></div>
														<div className="w-full col-span-3">
															<FormMessage />
														</div>
													</>
												)}
											</FormItem>
										)}
									/>
								</div>
								<div className="grid grid-cols-2 gap-4 mt-4">
									<FormField
										control={form.control}
										name="country"
										render={({field}) => (
											<FormItem className="grid items-center w-full grid-cols-4 gap-4 space-y-0">
												<FormLabel className="text-right">Country</FormLabel>
												<div className="col-span-3">
													<Select onValueChange={field.onChange} defaultValue={field.value}>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Select country" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{COUNTRY_LIST.map((country) => (
																<SelectItem key={country} value={country}>
																	{country}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
												{form.formState.errors.country && (
													<>
														<div></div>
														<div className="w-full col-span-3">
															<FormMessage />
														</div>
													</>
												)}
											</FormItem>
										)}
									/>
								</div>
								<div className="grid grid-cols-2 gap-4 mt-4 mb-8">
									<FormField
										control={form.control}
										name="state"
										render={({field}) => (
											<FormItem className="grid items-center w-full grid-cols-4 gap-4 space-y-0">
												<FormLabel className="text-right">
													{watch_country !== "Canada" ? "State" : "Province"}
												</FormLabel>
												<div className="col-span-3">
													<Select onValueChange={field.onChange} defaultValue={field.value}>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Select province" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{STATES[watch_country as keyof typeof STATES].map(
																(province: string) => (
																	<SelectItem key={province} value={province}>
																		{province}
																	</SelectItem>
																)
															)}
														</SelectContent>
													</Select>
												</div>
												{form.formState.errors.state && (
													<>
														<div></div>
														<div className="w-full col-span-3">
															<FormMessage />
														</div>
													</>
												)}
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="postal_code"
										render={({field}) => (
											<FormItem className="grid items-center w-full grid-cols-4 gap-4 space-y-0">
												<FormLabel className="text-right">
													{watch_country !== "Canada" ? "Zip Code" : "Postal Code"}
												</FormLabel>
												<FormControl className="col-span-3">
													<Input {...field} />
												</FormControl>
												{form.formState.errors.postal_code && (
													<>
														<div></div>
														<div className="w-full col-span-3">
															<FormMessage />
														</div>
													</>
												)}
											</FormItem>
										)}
									/>
								</div>
								<DialogFooter>
									<Button type="submit" disabled={mutation.isPending}>
										{mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
										Add Patient
									</Button>
								</DialogFooter>
							</form>
						</Form>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

const STATES = {
	None: [],
	Canada: [
		"Alberta",
		"British Columbia",
		"Manitoba",
		"New Brunswick",
		"Newfoundland and Labrador",
		"Nova Scotia",
		"Ontario",
		"Prince Edward Island",
		"Quebec",
		"Saskatchewan",
		"Northwest Territories",
		"Nunavut",
		"Yukon",
	],
	"United States": [
		"Alabama",
		"Alaska",
		"Arizona",
		"Arkansas",
		"California",
		"Colorado",
		"Connecticut",
		"Delaware",
		"Florida",
		"Georgia",
		"Hawaii",
		"Idaho",
		"Illinois",
		"Indiana",
		"Iowa",
		"Kansas",
		"Kentucky",
		"Louisiana",
		"Maine",
		"Maryland",
		"Massachusetts",
		"Michigan",
		"Minnesota",
		"Mississippi",
		"Missouri",
		"Montana",
		"Nebraska",
		"Nevada",
		"New Hampshire",
		"New Jersey",
		"New Mexico",
		"New York",
		"North Carolina",
		"North Dakota",
		"Ohio",
		"Oklahoma",
		"Oregon",
		"Pennsylvania",
		"Rhode Island",
		"South Carolina",
		"South Dakota",
		"Tennessee",
		"Texas",
		"Utah",
		"Vermont",
		"Virginia",
		"Washington",
		"West Virginia",
		"Wisconsin",
		"Wyoming",
	],
};

const COUNTRY_LIST = ["Canada", "United States"];

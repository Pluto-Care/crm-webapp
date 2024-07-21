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
import {ControllerRenderProps, UseFormReturn, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useMutation} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";
import {CalendarIcon, Loader2} from "lucide-react";
import {format} from "date-fns";
import {CreateAppointmentType, createAppointmentAPI} from "@/services/api/appointment/admin/create";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverTrigger} from "@/components/ui/popover";
import {PopoverContent} from "@radix-ui/react-popover";
import {cn} from "@/lib/utils";
import {Textarea} from "@/components/ui/textarea";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {debounce} from "lodash";
import * as React from "react";
import {Check, ChevronsUpDown} from "lucide-react";

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {searchPatientAPI} from "@/services/api/patients/admin/search";
import {searchOrgUserAPI} from "@/services/api/organization/admin/search_user";
import {HasPermission, useAuth} from "@/contexts/auth";
import AddPatientForm from "../patients/AddPatientForm";
import {createMyAppointmentAPI} from "@/services/api/appointment/my/create";
import {CREATE_PATIENTS} from "@/permissions/permissions";

const addAppointmentSchema = z.object({
	patient: z.string(),
	reason: z.string(),
	date: z.date(),
	type: z.enum(["in-person", "video", "phone"]),
	start_time: z.string(),
	duration: z.coerce.number({message: "Duration should be a number greater than 0"}).gte(1),
	assigned_to: z.string(),
	status: z.enum(["rescheduled", "cancelled", "completed", "confirmed"]),
});

interface Props {
	children: React.ReactNode;
	self?: boolean;
}

export default function AddAppointmentForm(props: Props) {
	const auth_context = useAuth();
	const navigate = useNavigate();
	const form = useForm<z.infer<typeof addAppointmentSchema>>({
		resolver: zodResolver(addAppointmentSchema),
		defaultValues: {
			status: "confirmed",
			assigned_to: props.self ? auth_context.user?.detail.id : undefined,
		},
	});

	//mutation
	const mutation = useMutation({
		mutationKey: ["addPatient"],
		mutationFn: (data: CreateAppointmentType) =>
			props.self ? createMyAppointmentAPI(data) : createAppointmentAPI(data),
		onSuccess: (data) => {
			// Redirect to the appointment page
			if (props.self) {
				navigate("/dashboard/my/appointments/" + data.id);
				return;
			}
			navigate("/dashboard/admin/appointments/" + data.id);
		},
	});

	const onSubmit = (data: z.infer<typeof addAppointmentSchema>) => {
		mutation.mutate(data);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{props.children}</DialogTrigger>
			<DialogContent className="min-w-[70rem]">
				<DialogHeader>
					<DialogTitle className="text-2xl">New Appointment</DialogTitle>
					<DialogDescription>Fill in the details below to make an appointment.</DialogDescription>
				</DialogHeader>
				<div className="mt-2">
					{mutation.isError && (
						<div className="p-4 mb-4 text-red-600 bg-red-100 border border-red-300 rounded">
							{mutation.error.message}
						</div>
					)}
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<div className="grid grid-cols-3 gap-8 mb-4">
								<FormField
									control={form.control}
									name="patient"
									render={({field}) => (
										<FormItem>
											<FormLabel>
												Patient <span className="text-base leading-4 text-destructive">*</span>
											</FormLabel>
											<PatientSelector form={form} field={field} />
											{form.formState.errors.patient && <FormMessage />}
											<HasPermission id={CREATE_PATIENTS} fallback={<></>}>
												<div className="text-[90%] text-muted-foreground pl-1">
													Can&apos;t find?{" "}
													<AddPatientForm onClose="close">
														<Button variant={"link"} className="px-0 !py-0 h-auto">
															Add new patient
														</Button>
													</AddPatientForm>
												</div>
											</HasPermission>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="assigned_to"
									render={({field}) => (
										<FormItem>
											<FormLabel>
												Assigned To <span className="text-base leading-4 text-destructive">*</span>
											</FormLabel>
											{props.self ? (
												<Input
													disabled={true}
													value={`${auth_context.user?.detail.first_name} ${auth_context.user?.detail.last_name}`}
												/>
											) : (
												<UserSelector form={form} field={field} />
											)}
											{form.formState.errors.assigned_to && <FormMessage />}
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="status"
									render={() => (
										<FormItem>
											<FormLabel>Status</FormLabel>
											<Input disabled={true} value={"Confirmed"} />
											{/* <StatusBox form={form} /> */}
											{form.formState.errors.status && <FormMessage />}
										</FormItem>
									)}
								/>
							</div>
							<div className="grid items-start grid-cols-3 gap-8 mb-4">
								<FormField
									control={form.control}
									name="date"
									render={({field}) => (
										<FormItem>
											<FormLabel>
												Date <span className="text-base leading-4 text-destructive">*</span>
											</FormLabel>
											<br />
											<Popover>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant={"outline"}
															className={cn(
																"w-full max-w-[240px] pl-3 text-left font-normal",
																!field.value && "text-muted-foreground"
															)}
														>
															{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
															<CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent
													className="w-auto p-0 border rounded-lg shadow bg-card"
													align="start"
												>
													<Calendar
														mode="single"
														selected={field.value}
														onSelect={field.onChange}
														disabled={(date) => {
															const today = new Date();
															today.setDate(today.getDate() - 1);
															return date < today;
														}}
														initialFocus
													/>
												</PopoverContent>
											</Popover>
											{form.formState.errors.date && <FormMessage />}
										</FormItem>
									)}
								/>
								<div className="col-span-2 pt-2">
									<FormField
										control={form.control}
										name="type"
										render={({field}) => (
											<FormItem>
												<FormLabel>
													Type <span className="text-base leading-4 text-destructive">*</span>
												</FormLabel>
												<RadioGroup
													onValueChange={field.onChange}
													defaultValue={field.value}
													className="flex items-center !mt-0"
												>
													<RadioGroupItem
														value="in-person"
														id="in-person"
														className="sr-only peer"
													/>
													<RadioGroupItem value="video" id="video" className="sr-only peer" />
													<RadioGroupItem value="phone" id="phone" className="sr-only peer" />
													<div className="flex gap-2">
														{[
															{value: "in-person", label: "In-person"},
															{value: "video", label: "Video"},
															{value: "phone", label: "Phone"},
														].map((type) => (
															<FormItem key={type.value} className="inline-block w-max">
																<FormControl>
																	<RadioGroupItem
																		value={type.value}
																		id={type.value}
																		className="sr-only peer"
																	/>
																</FormControl>
																<FormLabel
																	htmlFor={type.value}
																	className="flex cursor-pointer mr-2 flex-col items-center justify-between rounded-md border bg-popover px-4 py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:outline-2 peer-data-[state=checked]:outline peer-data-[state=checked]:outline-primary [&:has([data-state=checked])]:outline-primary"
																>
																	{type.label}
																</FormLabel>
															</FormItem>
														))}
													</div>
												</RadioGroup>
												{form.formState.errors.type && <FormMessage />}
											</FormItem>
										)}
									/>
								</div>
							</div>
							<div className="grid items-start grid-cols-3 gap-8 mb-4">
								<div className="col-span-2 pt-2">
									<FormField
										control={form.control}
										name="start_time"
										render={({field}) => (
											<FormItem>
												<FormLabel>
													Start Time <span className="text-base leading-4 text-destructive">*</span>
												</FormLabel>
												<RadioGroup
													onValueChange={field.onChange}
													defaultValue={field.value}
													className="block !mt-0"
												>
													{slots("08:00", "18:00").map((time, index) => (
														<FormItem className="inline-block w-max" key={index}>
															<FormControl>
																<RadioGroupItem value={time} id={time} className="sr-only peer" />
															</FormControl>
															<FormLabel
																htmlFor={time}
																className="flex cursor-pointer mr-2 flex-col items-center justify-between rounded-md border bg-popover px-4 py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:outline-2 peer-data-[state=checked]:outline peer-data-[state=checked]:outline-primary [&:has([data-state=checked])]:outline-primary"
															>
																{time}
															</FormLabel>
														</FormItem>
													))}
												</RadioGroup>
												{form.formState.errors.start_time && <FormMessage />}
											</FormItem>
										)}
									/>
								</div>
								<div>
									<FormField
										control={form.control}
										name="duration"
										render={({field}) => (
											<FormItem>
												<FormLabel>
													Duration (in minutes){" "}
													<span className="text-base leading-4 text-destructive">*</span>
												</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												{form.formState.errors.duration && <FormMessage />}
											</FormItem>
										)}
									/>
								</div>
							</div>
							<div>
								<FormField
									control={form.control}
									name="reason"
									render={({field}) => (
										<FormItem>
											<FormLabel>
												Reason <span className="text-base leading-4 text-destructive">*</span>
											</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Reason for the appointment"
													className="max-w-lg resize-none"
													{...field}
												/>
											</FormControl>
											{form.formState.errors.reason && <FormMessage />}
										</FormItem>
									)}
								/>
							</div>
							<DialogFooter>
								<Button type="submit" disabled={mutation.isPending}>
									{mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
									Add Appointment
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	);
}

const toMinutes = (str: string) =>
	str.split(":").reduce((h, m) => (parseInt(h) * 60 + +m).toString());

const toString = (min: number) => {
	const minute = min % 60;
	// append 0 if minute is less than 10
	return `${Math.floor(min / 60)}:${minute < 10 ? "0" + minute : minute}`;
};

function slots(startStr: string, endStr = "16:00") {
	const start: string = toMinutes(startStr);
	const end: string = toMinutes(endStr);
	return Array.from({length: Math.floor((parseInt(end) - parseInt(start)) / 30) + 1}, (_, i) =>
		toString(parseInt(start) + i * 30)
	);
}

function PatientSelector({
	form,
	field,
}: {
	form: UseFormReturn<z.infer<typeof addAppointmentSchema>>;
	field: ControllerRenderProps<z.infer<typeof addAppointmentSchema>, "patient">;
}) {
	const [open, setOpen] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);

	const mutation = useMutation({
		mutationKey: ["search_patient"],
		mutationFn: (value: string) => searchPatientAPI(value),
		onSuccess: () => {
			setIsLoading(false);
		},
		onError: () => {
			setIsLoading(false);
		},
	});

	const changeKeyword = debounce((value: string) => {
		if (value.length > 1) {
			mutation.mutate(value);
		}
	}, 500);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<FormControl>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="justify-between w-full"
					>
						{field.value && mutation.isSuccess && mutation.data.length > 0
							? mutation.data
									.filter((data) => data.id === field.value)
									.map((data) => data.first_name + " " + data.last_name)
							: "Select patient..."}
						<ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
					</Button>
				</FormControl>
			</PopoverTrigger>
			<PopoverContent className="z-10 -mt-1 border rounded-lg w-56 lg:w-64 xl:w-72 2xl:w-[20rem]">
				<Command shouldFilter={false}>
					<CommandInput
						placeholder="Search patient..."
						onValueChange={(keyword: string) => {
							setIsLoading(keyword.length > 0);
							changeKeyword(keyword);
						}}
					/>
					<CommandList>
						<CommandEmpty>
							{isLoading ? (
								<div className="flex justify-center">
									<Loader2 className="w-4 h-4 animate-spin" />
								</div>
							) : mutation.isIdle ? (
								<>Start typing a name</>
							) : (
								<>No patient found.</>
							)}
						</CommandEmpty>
						<CommandGroup className="block">
							{mutation.isSuccess
								? mutation.data.map((patient) => (
										<CommandItem
											key={patient.id}
											value={patient.id}
											onSelect={() => {
												form.setValue("patient", patient.id);
												setOpen(false);
											}}
											className="block"
										>
											<div className="flex items-center gap-2">
												<div className="size-4">
													<Check
														className={cn(
															"h-4 w-4",
															field.value === patient.id ? "opacity-100" : "opacity-0"
														)}
													/>
												</div>
												<div className="flex-1 overflow-hidden">
													{patient.first_name} {patient.last_name}
													<div className="text-[95%] text-muted-foreground whitespace-nowrap text-ellipsis">
														{patient.phone} &mdash; {patient.city}, {patient.state}
													</div>
												</div>
											</div>
										</CommandItem>
								  ))
								: null}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

function UserSelector({
	form,
	field,
}: {
	form: UseFormReturn<z.infer<typeof addAppointmentSchema>>;
	field: ControllerRenderProps<z.infer<typeof addAppointmentSchema>, "assigned_to">;
}) {
	const [open, setOpen] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);

	const mutation = useMutation({
		mutationKey: ["search_user"],
		mutationFn: (value: string) => searchOrgUserAPI(value),
		onSuccess: () => {
			setIsLoading(false);
		},
		onError: () => {
			setIsLoading(false);
		},
	});

	const changeKeyword = debounce((value: string) => {
		if (value.length > 1) {
			mutation.mutate(value);
		}
	}, 500);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<FormControl>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="justify-between w-full"
					>
						{field.value && mutation.isSuccess && mutation.data.length > 0
							? mutation.data
									.filter((data) => data.id === field.value)
									.map((data) => data.first_name + " " + data.last_name)
							: "Select user..."}
						<ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
					</Button>
				</FormControl>
			</PopoverTrigger>
			<PopoverContent className="z-10 p-0 -mt-1 border rounded-lg w-56 lg:w-64 xl:w-72 2xl:w-[20rem]">
				<Command shouldFilter={false}>
					<CommandInput
						placeholder="Search user..."
						onValueChange={(keyword: string) => {
							setIsLoading(keyword.length > 0);
							changeKeyword(keyword);
						}}
					/>
					<CommandList>
						<CommandEmpty>
							{isLoading ? (
								<div className="flex justify-center">
									<Loader2 className="w-4 h-4 animate-spin" />
								</div>
							) : mutation.isIdle ? (
								<>Start typing a name</>
							) : (
								<>No user found.</>
							)}
						</CommandEmpty>
						<CommandGroup>
							{mutation.isSuccess
								? mutation.data.map((user) => (
										<CommandItem
											key={user.id}
											value={user.id}
											onSelect={() => {
												form.setValue("assigned_to", user.id);
												setOpen(false);
											}}
											className="block"
										>
											<div className="flex items-center gap-2">
												<div className="size-4">
													<Check
														className={cn(
															"h-4 w-4",
															field.value === user.id ? "opacity-100" : "opacity-0"
														)}
													/>
												</div>
												<div className="flex-1 overflow-hidden">
													{user.first_name} {user.last_name}
													<div className="text-[95%] text-muted-foreground whitespace-nowrap text-ellipsis">
														{user.email}
													</div>
												</div>
											</div>
										</CommandItem>
								  ))
								: null}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

// type Status = {
// 	value: string;
// 	label: string;
// 	icon: LucideIcon;
// };

// const statuses: Status[] = [
// 	{
// 		value: "confirmed",
// 		label: "Confirmed",
// 		icon: CircleDotDashed,
// 	},
// ];

// function StatusBox({form}: {form: UseFormReturn<z.infer<typeof addAppointmentSchema>>}) {
// 	const [open, setOpen] = React.useState(false);
// 	const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(null);

// 	return (
// 		<div>
// 			<Popover open={open} onOpenChange={setOpen}>
// 				<PopoverTrigger asChild>
// 					<FormControl>
// 						<Button variant="outline" className="justify-start w-full">
// 							{selectedStatus ? (
// 								<>
// 									<selectedStatus.icon className="w-4 h-4 mr-2 shrink-0" />
// 									{selectedStatus.label}
// 								</>
// 							) : (
// 								<>+ Set status</>
// 							)}
// 						</Button>
// 					</FormControl>
// 				</PopoverTrigger>
// 				<PopoverContent className="p-0 mt-1 border rounded-md" side="bottom" align="start">
// 					<Command>
// 						<CommandList>
// 							<CommandEmpty>No results found.</CommandEmpty>
// 							<CommandGroup>
// 								{statuses.map((status) => (
// 									<CommandItem
// 										key={status.value}
// 										value={status.value}
// 										onSelect={(value) => {
// 											setSelectedStatus(
// 												statuses.find((priority) => priority.value === value) || null
// 											);
// 											form.setValue("status", value as "confirmed" | "completed");
// 											setOpen(false);
// 										}}
// 									>
// 										<status.icon
// 											className={cn(
// 												"mr-2 h-4 w-4",
// 												status.value === selectedStatus?.value ? "opacity-100" : "opacity-40"
// 											)}
// 										/>
// 										<span className="pr-16">{status.label}</span>
// 									</CommandItem>
// 								))}
// 							</CommandGroup>
// 						</CommandList>
// 					</Command>
// 				</PopoverContent>
// 			</Popover>
// 		</div>
// 	);
// }

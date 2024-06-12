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
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useMutation} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";
import {CalendarIcon, Loader2} from "lucide-react";
import {format} from "date-fns";
import {createAppointmentAPI} from "@/services/api/appointment/admin/create";
import {AppointmentType} from "@/types/appointment";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverTrigger} from "@/components/ui/popover";
import {PopoverContent} from "@radix-ui/react-popover";
import {cn} from "@/lib/utils";
import {Textarea} from "@/components/ui/textarea";

const addAppointmentSchema = z.object({
	patient: z.string(),
	reason: z.string(),
	date: z.date(),
	start_time: z.string(),
	end_time: z.string(),
	assigned_to: z.string(),
	status: z.string(),
});

export default function AddAppointmentForm(props: {children: React.ReactNode}) {
	const navigate = useNavigate();
	const form = useForm<z.infer<typeof addAppointmentSchema>>({
		resolver: zodResolver(addAppointmentSchema),
	});

	//mutation
	const mutation = useMutation({
		mutationKey: ["addPatient"],
		mutationFn: (data: unknown) => createAppointmentAPI(data as AppointmentType),
		onSuccess: (data) => {
			navigate("/dashboard/admin/appointment/" + data.id);
		},
	});

	const onSubmit = (data: z.infer<typeof addAppointmentSchema>) => {
		// TODO: Shape the data before sending to the server
		//mutation.mutate(data);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{props.children}</DialogTrigger>
			<DialogContent className="w-full h-full min-w-full">
				<div className="container relative mx-auto overflow-y-scroll">
					<DialogHeader>
						<DialogTitle className="text-2xl">New Appointment</DialogTitle>
						<DialogDescription>Fill in the details below to make an appointment.</DialogDescription>
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
										name="patient"
										render={({field}) => (
											<FormItem className="grid items-center w-full grid-cols-4 gap-4 space-y-0">
												<FormLabel className="text-right">Patient</FormLabel>
												<FormControl className="col-span-3">
													<Input {...field} />
												</FormControl>
												{form.formState.errors.patient && (
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
										name="assigned_to"
										render={({field}) => (
											<FormItem className="grid items-center w-full grid-cols-4 gap-4 space-y-0">
												<FormLabel className="text-right">Assigned To</FormLabel>
												<FormControl className="col-span-3">
													<Input {...field} />
												</FormControl>
												{form.formState.errors.assigned_to && (
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
									Schedule
								</DialogDescription>
								<div className="grid grid-cols-2 gap-4 mb-4">
									<FormField
										control={form.control}
										name="date"
										render={({field}) => (
											<FormItem className="grid items-center w-full grid-cols-4 gap-4 space-y-0">
												<FormLabel className="text-right">Start At</FormLabel>
												<Popover>
													<PopoverTrigger asChild>
														<FormControl>
															<Button
																variant={"outline"}
																className={cn(
																	"w-[240px] pl-3 text-left font-normal",
																	!field.value && "text-muted-foreground"
																)}
															>
																{field.value ? (
																	format(field.value, "PPP")
																) : (
																	<span>Pick a date</span>
																)}
																<CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
															</Button>
														</FormControl>
													</PopoverTrigger>
													<PopoverContent className="w-auto p-0" align="start">
														<Calendar
															mode="single"
															selected={field.value}
															onSelect={field.onChange}
															disabled={(date) =>
																date > new Date() || date < new Date("1900-01-01")
															}
															initialFocus
														/>
													</PopoverContent>
												</Popover>
												{form.formState.errors.date && (
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
										name="start_time"
										render={({field}) => (
											<FormItem className="grid items-center w-full grid-cols-4 gap-4 space-y-0">
												<FormLabel className="text-right">Start Time</FormLabel>
												<FormControl className="col-span-3">
													<Input {...field} />
												</FormControl>
												{form.formState.errors.start_time && (
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
										name="end_time"
										render={({field}) => (
											<FormItem className="grid items-center w-full grid-cols-4 gap-4 space-y-0">
												<FormLabel className="text-right">End Time</FormLabel>
												<FormControl className="col-span-3">
													<Input {...field} />
												</FormControl>
												{form.formState.errors.end_time && (
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
										name="reason"
										render={({field}) => (
											<FormItem className="grid items-center w-full grid-cols-4 gap-4 space-y-0">
												<FormLabel className="text-right">Reason</FormLabel>
												<FormControl className="col-span-3">
													<Textarea
														placeholder="Reason for the appointment"
														className="resize-none"
														{...field}
													/>
												</FormControl>
												{form.formState.errors.reason && (
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
										name="status"
										render={({field}) => (
											<FormItem className="grid items-center w-full grid-cols-4 gap-4 space-y-0">
												<FormLabel className="text-right">Status</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={(field.value ?? "").toString()}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Appointment Current Status" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{["pending", "accepted", "completed"].map((status, index) => (
															<SelectItem key={index} value={status}>
																{status}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												{form.formState.errors.status && (
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
										Add Appointment
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

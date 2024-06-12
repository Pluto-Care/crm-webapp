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
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";

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
								<div className="grid grid-cols-3 gap-8 mb-4">
									<FormField
										control={form.control}
										name="patient"
										render={({field}) => (
											<FormItem>
												<FormLabel>Patient</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												{form.formState.errors.patient && <FormMessage />}
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="assigned_to"
										render={({field}) => (
											<FormItem>
												<FormLabel>Assigned To</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												{form.formState.errors.assigned_to && <FormMessage />}
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="status"
										render={({field}) => (
											<FormItem>
												<FormLabel>Status</FormLabel>
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
												{form.formState.errors.status && <FormMessage />}
											</FormItem>
										)}
									/>
								</div>
								<div className="mb-4 space-y-4">
									<FormField
										control={form.control}
										name="date"
										render={({field}) => (
											<FormItem>
												<FormLabel>Date</FormLabel>
												<br />
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
																const yesterday = new Date(today - 1000 * 60 * 60 * 24);
																return date < yesterday;
															}}
															initialFocus
														/>
													</PopoverContent>
												</Popover>
												{form.formState.errors.date && <FormMessage />}
											</FormItem>
										)}
									/>
								</div>
								<div className="grid items-start grid-cols-3 gap-8 mb-4">
									<div className="col-span-2">
										<FormField
											control={form.control}
											name="start_time"
											render={({field}) => (
												<FormItem>
													<FormLabel>Start Time</FormLabel>
													<RadioGroup
														onValueChange={field.onChange}
														defaultValue={field.value}
														className="block"
													>
														{slots("08:00", "18:00").map((time, index) => (
															<FormItem className="inline-block w-max">
																<FormControl key={index}>
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
											name="end_time"
											render={({field}) => (
												<FormItem>
													<FormLabel>End Time</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													{form.formState.errors.end_time && <FormMessage />}
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
												<FormLabel>Reason</FormLabel>
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

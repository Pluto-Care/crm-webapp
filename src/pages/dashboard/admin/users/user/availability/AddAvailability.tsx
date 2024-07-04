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
import {Button} from "@/components/ui/button";
import {useMutation} from "@tanstack/react-query";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {CalendarIcon, Loader2} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import {format} from "date-fns";
import {cn} from "@/lib/utils";
import MultipleSelector, {Option} from "@/components/ui/multiselect";
import {TimePicker12Demo} from "@/components/TimePicker12";
import {UserType} from "@/types/user";
import spacetime from "spacetime";
import {addAvailabilityAPI} from "@/services/api/availability/admin/add_by_admin";
import {toast} from "sonner";

const addAvailabilitySchema = z.object({
	start_time: z.date(),
	end_time: z.date(),
	start_date: z.date(),
	end_date: z.date().nullish(),
	days: z.array(z.string()),
	user: z.string(),
});

const weekdays: Option[] = [
	{value: "0", label: "Monday"},
	{value: "1", label: "Tuesday"},
	{value: "2", label: "Wednesday"},
	{value: "3", label: "Thursday"},
	{value: "4", label: "Friday"},
	{value: "5", label: "Saturday"},
	{value: "6", label: "Sunday"},
];

export default function AddAvailabilityForm({user}: {user: UserType}) {
	const form = useForm<z.infer<typeof addAvailabilitySchema>>({
		resolver: zodResolver(addAvailabilitySchema),
		defaultValues: {
			user: user.id,
			end_time: new Date(new Date().setHours(17, 0, 0, 0)),
			start_date: new Date(),
			end_date: undefined,
			days: [],
		},
	});

	//mutation
	const mutation = useMutation({
		mutationKey: ["add_availability"],
		mutationFn: (data: unknown) => addAvailabilityAPI(data),
		onSuccess: () => {
			toast.success("Availability added successfully.", {position: "top-right"});
			form.reset();
		},
	});

	const onSubmit = (data: z.infer<typeof addAvailabilitySchema>) => {
		// change date from timestamp to YYYY-MM-DD
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const d: any = {...data};
		d.start_date = format(data.start_date, "yyyy-MM-dd");
		d.end_date = data.end_date ? format(data.end_date, "yyyy-MM-dd") : null;
		mutation.mutate(d);
	};

	return (
		<div className="px-6 py-6 border rounded-xl">
			<h3>Add Availability</h3>
			<p className="text-sm text-muted-foreground">
				The availability will be set according to timezone set for this user which is{" "}
				<b>{user.timezone}</b> ({spacetime(user.timezone).timezone().current.offset}).
			</p>
			{mutation.isError && (
				<div className="px-4 py-2 my-4 text-sm text-red-600 bg-red-100 border border-red-300 rounded dark:bg-red-400/10 dark:text-red-400">
					{mutation.error.message}
				</div>
			)}
			{mutation.isSuccess && (
				<div className="px-4 py-2 my-4 text-sm text-green-700 bg-green-100 border border-green-300 rounded dark:bg-green-400/10 dark:text-green-400">
					Availability added successfully.
				</div>
			)}
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="mt-6 mb-6 space-y-6">
						<div className="grid grid-cols-3 gap-4">
							<FormField
								control={form.control}
								name="start_date"
								render={({field}) => (
									<FormItem>
										<FormLabel>
											Start Date <span className="text-base text-red-500">*</span>
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
										<FormDescription>Set availability starting this day</FormDescription>
										{form.formState.errors.start_date && <FormMessage />}
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="end_date"
								render={({field}) => (
									<FormItem>
										<FormLabel>End Date</FormLabel>
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
													selected={field.value || undefined}
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
										<FormDescription className="max-w-80">
											Availability until and including this day. Leave this empty to set an
											indefinite end date.
										</FormDescription>
										{form.formState.errors.start_date && <FormMessage />}
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="days"
								render={({field}) => (
									<FormItem className="mt-2">
										<FormLabel>Week days</FormLabel>
										<FormControl>
											<MultipleSelector
												className="max-w-96"
												value={
													field.value
														? (field.value.map((v) =>
																weekdays.find((w) => w.value === v)
														  ) as Option[])
														: []
												}
												onChange={(value: Option[]) => {
													if (value) {
														field.onChange(value.map((v) => v.value));
													} else {
														field.onChange([]);
													}
												}}
												defaultOptions={weekdays}
												placeholder="Select week days..."
												emptyIndicator={
													<p className="text-lg leading-10 text-center text-gray-600 dark:text-gray-400">
														no results found.
													</p>
												}
											/>
										</FormControl>
										<FormDescription>
											Every week on these days (recurring). To set for a single day, leave this
											field blank.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-3 gap-4">
							<FormField
								control={form.control}
								name="start_time"
								render={({field}) => (
									<FormItem>
										<FormLabel>
											Start time <span className="text-base text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<TimePicker12Demo date={field.value} setDate={field.onChange} />
										</FormControl>
										<FormDescription>Availability starts at time</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="end_time"
								render={({field}) => (
									<FormItem>
										<FormLabel>
											End time <span className="text-base text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<TimePicker12Demo date={field.value} setDate={field.onChange} />
										</FormControl>
										<FormDescription>Availability ends at time</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>
					<Button type="submit" disabled={mutation.isPending}>
						{mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
						Add Availability
					</Button>
				</form>
			</Form>
		</div>
	);
}

import DashboardLayout from "../../_layout";
import {
	ColumnDef,
	flexRender,
	getFilteredRowModel,
	getCoreRowModel,
	useReactTable,
	GlobalFilterTableState,
} from "@tanstack/react-table";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Input} from "@/components/ui/input";
import {Edit2, MoreHorizontal, Trash2} from "lucide-react";

import {Button} from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {useQuery} from "@tanstack/react-query";
import {useState} from "react";
import {Skeleton} from "@/components/ui/skeleton";
import {HasPermission} from "@/contexts/auth";
import {Link} from "react-router-dom";
import {Helmet} from "react-helmet";
import {APP_NAME} from "@/config";
import {ErrorMessageAlert} from "@/components/utils/ErrorMessageAlert";
import {LoadingScreen} from "@/components/utils/LoadingScreen";
import {MAKE_APPPOINTMENTS} from "@/permissions/permissions";
import {getOrgAppointmentListAPI} from "@/services/api/appointment/admin/list";
import {AppointmentType} from "@/types/appointment";
import AddAppointmentForm from "./AddAppointmentForm";
import {datePretty, timePretty} from "@/lib/dateTimeUtils";
import {formatPhoneNumber} from "@/lib/phoneNumberFormatter";
import {Badge} from "@/components/ui/badge";
import SunRays from "@/components/utils/SunRays";

export const columns: ColumnDef<AppointmentType>[] = [
	{
		id: "patient",
		header: "Patient",
		accessorFn: (row) => `${row.patient.first_name} ${row.patient.last_name}`,
	},
	{
		header: "Scheduled Date",
		accessorFn: (row) => datePretty(row.start_time) + " at " + timePretty(row.start_time),
	},
	{
		accessorKey: "status",
		header: "Status",
	},
	{
		header: "Assigned To",
		accessorFn: (row) =>
			row.assigned_to ? `${row.assigned_to.first_name} ${row.assigned_to.last_name}` : null,
	},
	{
		accessorKey: "type",
		header: "Type",
	},
	{
		header: "Created By",
		accessorFn: (row) =>
			row.created_by ? `${row.created_by.first_name} ${row.created_by.last_name}` : null,
	},
	{
		id: "actions",
		cell: ({row}) => {
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="w-8 h-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="w-4 h-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem>View details</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => {
								console.log(row);
							}}
							className="flex items-center gap-2"
						>
							<Edit2 className="size-3.5" />
							Edit Appointment
						</DropdownMenuItem>
						<DropdownMenuItem
							className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:!text-red-600 hover:dark:!text-red-400"
							onClick={() => {}}
						>
							<Trash2 className="size-4" />
							Cancel
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export default function AdminAppointmentsDashboard() {
	const apt_list_query = useQuery({
		queryKey: ["org_appointment_list"],
		queryFn: () => getOrgAppointmentListAPI(),
		refetchOnWindowFocus: false,
	});

	return (
		<DashboardLayout>
			<Helmet>
				<title>Appointments &mdash; {APP_NAME}</title>
			</Helmet>
			<SunRays color="purple" />
			<div className="flex mb-5">
				<div className="flex-1">
					<h1 className="text-xl font-semibold md:text-2xl">Appointment List</h1>
					{apt_list_query.isLoading ? (
						<Skeleton className="w-48 h-6" />
					) : (
						<p className="!mt-1 text-sm text-muted-foreground">
							Total appointments: {apt_list_query.data?.length}
						</p>
					)}
				</div>
				<div>
					<HasPermission id={MAKE_APPPOINTMENTS} fallback={<></>}>
						<AddAppointmentForm>
							<Button variant={"default"}>Create New Appoitment</Button>
						</AddAppointmentForm>
					</HasPermission>
				</div>
			</div>
			{apt_list_query.isSuccess ? (
				<DataTable columns={columns} data={apt_list_query.data} />
			) : apt_list_query.isError ? (
				<ErrorMessageAlert
					title="An error has occured"
					message="Please refresh this page or contact support."
				/>
			) : apt_list_query.isLoading ? (
				<LoadingScreen />
			) : null}
		</DashboardLayout>
	);
}

function DataTable<TData, TValue>({columns, data}: DataTableProps<TData, TValue>) {
	const [globalFilter, setGlobalFilter] = useState<GlobalFilterTableState | null>(null);
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			globalFilter,
		},
		enableGlobalFilter: true,
		onGlobalFilterChange: (newGlobalFilter) => {
			setGlobalFilter({globalFilter: newGlobalFilter});
		},
		globalFilterFn: (row) => {
			const values = JSON.stringify(row);
			return values.toLowerCase().includes(globalFilter?.globalFilter.toLowerCase());
		},
	});

	return (
		<>
			<div className="grid gap-4 mt-4">
				<div>
					<Input
						placeholder="Filter appointments..."
						value={globalFilter?.globalFilter ?? ""}
						onChange={(event) => {
							table.setGlobalFilter(event.target.value);
						}}
						className="w-full max-w-xs"
					/>
				</div>
			</div>
			<div className="my-4 border rounded-lg">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row, row_index) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
									{row.getVisibleCells().map((cell, index) =>
										index === 0 ? (
											<TableCell key={cell.id} className="p-0">
												<div className="block w-full h-full p-4">
													<Link
														className=" hover:underline hover:underline-offset-2"
														to={`/dashboard/admin/users/${
															(data as AppointmentType[])[row_index]["id"]
														}`}
													>
														{flexRender(cell.column.columnDef.cell, cell.getContext())}
													</Link>
													<div className="text-muted-foreground text-[95%]">
														+1{" "}
														{formatPhoneNumber(
															(data as AppointmentType[])[row_index]["patient"]["phone"]
														)}
													</div>
												</div>
											</TableCell>
										) : cell.id.split("_")[1] === "status" ? (
											<TableCell key={cell.id}>
												<Badge
													variant={
														cell.getValue() === "accepted"
															? "default"
															: cell.getValue() === "cancelled"
															? "destructive"
															: "outline"
													}
												>
													{flexRender(cell.column.columnDef.cell, cell.getContext())}
												</Badge>
											</TableCell>
										) : (
											<TableCell key={cell.id}>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</TableCell>
										)
									)}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</>
	);
}

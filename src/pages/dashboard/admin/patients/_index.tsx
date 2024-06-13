import {PatientType} from "@/types/patient";
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
import {MoreHorizontal} from "lucide-react";

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
import {getOrgPatientListAPI} from "@/services/api/patients/admin/list";
import {useState} from "react";
import {Skeleton} from "@/components/ui/skeleton";
import AddPatientForm from "./AddPatientForm";
import {HasPermission} from "@/contexts/auth";
import {Link} from "react-router-dom";
import {Helmet} from "react-helmet";
import {APP_NAME} from "@/config";
import {CREATE_PATIENTS} from "@/permissions/permissions";

export const columns: ColumnDef<PatientType>[] = [
	{
		accessorKey: "first_name",
		header: "First Name",
	},
	{
		accessorKey: "last_name",
		header: "Last Name",
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "phone",
		header: "Phone",
	},
	{
		accessorKey: "city",
		header: "City",
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
						<DropdownMenuItem>Files</DropdownMenuItem>
						<DropdownMenuItem>Calling History</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => {
								console.log(row);
							}}
						>
							Edit Profile
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => {}}>Delete</DropdownMenuItem>
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

export default function AdminPatientsDashboard() {
	const patient_list_query = useQuery({
		queryKey: ["org_patient_list"],
		queryFn: () => getOrgPatientListAPI(),
		refetchOnWindowFocus: false,
	});

	return (
		<DashboardLayout>
			<Helmet>
				<title>Patients &mdash; {APP_NAME}</title>
			</Helmet>
			<div className="flex mb-5">
				<div className="flex-1">
					<h1 className="text-xl font-semibold md:text-2xl">Patient List</h1>
					{patient_list_query.isLoading ? (
						<Skeleton className="w-48 h-6" />
					) : (
						<p className="!mt-1 text-sm text-muted-foreground">
							Total count: {patient_list_query.data?.length}
						</p>
					)}
				</div>
				<div>
					<HasPermission id={CREATE_PATIENTS} fallback={<></>}>
						<AddPatientForm>
							<Button variant={"default"}>Add New Patient</Button>
						</AddPatientForm>
					</HasPermission>
				</div>
			</div>
			<DataTable
				columns={columns}
				data={patient_list_query.isSuccess ? patient_list_query.data : []}
			/>
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
			const values = row
				.getAllCells()
				.map((cell) => cell.getValue())
				.join(" ");
			return values.toLowerCase().includes(globalFilter?.globalFilter.toLowerCase());
		},
	});

	return (
		<>
			<div className="grid gap-4 mt-4">
				<div>
					<Input
						placeholder="Filter patients..."
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
									{row.getVisibleCells().map((cell, index) => (
										<TableCell key={cell.id}>
											{index === 0 ? (
												<Link
													to={`/dashboard/admin/patients/${
														(data as PatientType[])[row_index]["id"]
													}`}
												>
													{flexRender(cell.column.columnDef.cell, cell.getContext())}
												</Link>
											) : (
												flexRender(cell.column.columnDef.cell, cell.getContext())
											)}
										</TableCell>
									))}
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

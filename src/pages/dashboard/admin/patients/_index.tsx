import {Patient} from "@/types/patient";
import DashboardLayout from "../../_layout";
import {
	ColumnDef,
	flexRender,
	ColumnFiltersState,
	getFilteredRowModel,
	getCoreRowModel,
	useReactTable,
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
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {useQuery} from "@tanstack/react-query";
import {getOrgPatientListAPI} from "@/services/api/patients/list";
import {useState} from "react";

export const columns: ColumnDef<Patient>[] = [
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
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbPage>Admin Menu</BreadcrumbPage>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Patients</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<h1 className="my-4 text-lg font-semibold md:text-2xl">Patient List</h1>
			<DataTable
				columns={columns}
				data={patient_list_query.isSuccess ? patient_list_query.data : []}
			/>
		</DashboardLayout>
	);
}

function DataTable<TData, TValue>({columns, data}: DataTableProps<TData, TValue>) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			columnFilters,
		},
	});

	return (
		<>
			<div className="flex gap-4 my-4">
				<div className="py-2.5 text-sm font-medium">Filter</div>
				<div className="">
					<Input
						value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
						onChange={(event) => table.getColumn("email")?.setFilterValue(event.target.value)}
						className="max-w-sm"
					/>
					<p className="!mt-1 text-xs text-muted-foreground">
						Filter by name, email, or phone number.
					</p>
				</div>
			</div>
			<div className="my-2 border rounded-md">
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
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
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

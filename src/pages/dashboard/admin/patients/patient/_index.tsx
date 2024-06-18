import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {ErrorMessageAlert} from "@/components/utils/ErrorMessageAlert";
import {LoadingScreen} from "@/components/utils/LoadingScreen";
import {APP_NAME} from "@/config";
import DashboardLayout from "@/pages/dashboard/_layout";
import {getPatientAPI} from "@/services/api/patients/admin/single_patient/get";
import {PatientType} from "@/types/patient";
import {Label} from "@radix-ui/react-dropdown-menu";
import {useQuery} from "@tanstack/react-query";
import {Helmet} from "react-helmet";
import {Link, Navigate, useParams} from "react-router-dom";
import PatientNotes from "./PatientNotes";

export default function PatientDetailPage() {
	const {patient_id} = useParams();

	const patient_query = useQuery({
		queryKey: ["patient_detail", patient_id],
		queryFn: () => (patient_id ? getPatientAPI(patient_id) : Promise.reject("No patient_id")),
		refetchOnWindowFocus: false,
	});

	if (!patient_id) {
		return <Navigate to="/dashboard/admin/patients" />;
	}

	return (
		<DashboardLayout>
			{patient_query.isLoading ? (
				<LoadingScreen message="Loading patient..." />
			) : patient_query.isSuccess ? (
				<>
					<Helmet>
						<title>
							Patient &mdash; {patient_query.data?.first_name} {patient_query.data?.last_name}{" "}
							&mdash; {APP_NAME}
						</title>
					</Helmet>
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>Admin Dashboard</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<Link to="/dashboard/admin/patients">Patients</Link>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbPage>
								{patient_query.data?.first_name} {patient_query.data?.last_name}
							</BreadcrumbPage>
						</BreadcrumbList>
					</Breadcrumb>

					<div className="flex mt-6 mb-5">
						<div className="flex-1">
							<h1 className="text-xl font-semibold md:text-2xl">
								{patient_query.data?.first_name} {patient_query.data?.last_name}
							</h1>
							<p className="!mt-1 text-sm text-muted-foreground">Patient</p>
						</div>
						<div></div>
					</div>
					<Tabs defaultValue="view" className="w-full my-4">
						<div className="relative flex items-start gap-8">
							<TabsList className="flex flex-col !h-auto min-w-56 sticky p-2 top-20">
								<TabsTrigger value="view" className="justify-end w-full">
									Data
								</TabsTrigger>
								<TabsTrigger value="edit" className="justify-end w-full">
									Appointment History
								</TabsTrigger>
							</TabsList>
							<div className="flex-1">
								<div>
									<TabsContent value="view" className="!mt-0">
										{patient_query.isSuccess && (
											<div className="grid grid-cols-2 gap-8">
												<div className="col-span-1">
													<div className="px-5 py-4 rounded-md bg-muted/70">
														<PatientDetails patient={patient_query.data} />
													</div>
												</div>
												<div className="col-span-1">
													<PatientNotes patient_id={patient_query.data.id} />
												</div>
											</div>
										)}
									</TabsContent>
									<TabsContent value="edit">Change your password here.</TabsContent>
								</div>
							</div>
						</div>
					</Tabs>
				</>
			) : patient_query.isError ? (
				<ErrorMessageAlert
					title="Failed to load patient data"
					message="Try refreshing the page or go back to the previous page and try again."
				/>
			) : null}
		</DashboardLayout>
	);
}

function PatientDetails({patient}: {patient: PatientType}) {
	return (
		<>
			<h2 className="mb-4 text-xl">Details</h2>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<Label>First Name</Label>
					<div>{patient.first_name}</div>
				</div>
				<div>
					<Label>Last Name</Label>
					<div>{patient.last_name}</div>
				</div>
				<div>
					<Label>Email</Label>
					<div>{patient.email}</div>
				</div>
				<div>
					<Label>Phone</Label>
					<div>{patient.phone}</div>
				</div>
				<div>
					<Label>Address</Label>
					<div>{patient.street}</div>
				</div>
				<div>
					<Label>City</Label>
					<div>{patient.city}</div>
				</div>
				<div>
					<Label>State</Label>
					<div>{patient.state}</div>
				</div>
				<div>
					<Label>Zip</Label>
					<div>{patient.postal_code}</div>
				</div>
				<div>
					<Label>Country</Label>
					<div>{patient.country}</div>
				</div>
			</div>
		</>
	);
}

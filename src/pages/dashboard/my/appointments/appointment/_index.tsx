import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {ErrorMessageAlert} from "@/components/utils/ErrorMessageAlert";
import {LoadingScreen} from "@/components/utils/LoadingScreen";
import {APP_NAME} from "@/config";
import DashboardLayout from "@/pages/dashboard/_layout";
import {useQuery} from "@tanstack/react-query";
import {Helmet} from "react-helmet";
import {Link, Navigate, useParams} from "react-router-dom";
import {datePretty, dateTimePretty, timePretty} from "@/lib/dateTimeUtils";
import {formatPhoneNumber} from "@/lib/phoneNumberFormatter";
import {formatPureDatePretty} from "@/lib/dateTimeUtils";
import {
	MySingleAppointmentType,
	getMySingleAppointmentAPI,
} from "@/services/api/appointment/my/get_single";

export default function MyAppointmentDetailPage() {
	const {appointment_id} = useParams();

	const apt_query = useQuery({
		queryKey: ["my_apt_detail", appointment_id],
		queryFn: () =>
			appointment_id
				? getMySingleAppointmentAPI(appointment_id)
				: Promise.reject("No appointment_id provided"),
		refetchOnWindowFocus: false,
		retry: false,
	});

	if (!appointment_id) {
		return <Navigate to="/dashboard/my/appointments" />;
	}

	return (
		<DashboardLayout>
			{apt_query.isLoading ? (
				<LoadingScreen message="Loading appointment..." />
			) : apt_query.isSuccess ? (
				<>
					<Helmet>
						<title>
							Appointment &mdash; {apt_query.data?.patient.first_name}{" "}
							{apt_query.data?.patient.last_name} &mdash; {APP_NAME}
						</title>
					</Helmet>
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<Link to="/dashboard/my/appointments">Appointments</Link>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbPage>
								{apt_query.data?.patient.first_name} {apt_query.data?.patient.last_name}
							</BreadcrumbPage>
						</BreadcrumbList>
					</Breadcrumb>

					<div className="flex mt-6 mb-5">
						<div className="flex-1">
							<h1 className="text-xl font-semibold md:text-2xl">
								{apt_query.data?.patient.first_name} {apt_query.data?.patient.last_name}
							</h1>
							<p className="!mt-1 text-sm text-muted-foreground">Patient Appointment</p>
						</div>
						<div></div>
					</div>
					<div>{apt_query.isSuccess && <AppointmentDetails apt={apt_query.data} />}</div>
				</>
			) : apt_query.isError ? (
				<ErrorMessageAlert
					title="Failed to load data"
					message={`Try refreshing the page or go back to the previous page and try again. [${apt_query.error}]`}
				/>
			) : null}
		</DashboardLayout>
	);
}

function AppointmentDetails({apt}: {apt: MySingleAppointmentType}) {
	return (
		<div className="grid gap-8 xl:grid-cols-2">
			<fieldset className="grid gap-6 p-4 border rounded-lg">
				<legend className="px-1 -ml-1 text-sm font-medium">Appointment Details</legend>
				<div className="grid gap-3 lg:grid-cols-2">
					<div>
						<div className="text-muted-foreground">Date</div>
						<div className="font-medium">{datePretty(apt.appointment.start_time)}</div>
					</div>
					<div>
						<div className="text-muted-foreground">Time</div>
						<div className="font-medium">{timePretty(apt.appointment.start_time)}</div>
					</div>
					<div>
						<div className="text-muted-foreground">Type</div>
						<div className="font-medium">{apt.appointment.type}</div>
					</div>
					<div>
						<div className="text-muted-foreground">Status</div>
						<div className="font-medium">{apt.appointment.status}</div>
					</div>
					<div>
						<div className="text-muted-foreground">Created on</div>
						<div className="font-medium">{dateTimePretty(apt.appointment.created_at)}</div>
					</div>
				</div>
			</fieldset>
			<fieldset className="grid gap-6 p-4 border rounded-lg">
				<legend className="px-1 -ml-1 text-sm font-medium">Patient Details</legend>
				<div className="grid gap-3 lg:grid-cols-2">
					<div>
						<div className="text-muted-foreground">Patient Name</div>
						<div className="font-medium">
							{apt.patient.first_name} {apt.patient.last_name}
						</div>
					</div>
					<div>
						<div className="text-muted-foreground">Phone</div>
						<div className="font-medium">+1 {formatPhoneNumber(apt.patient.phone)}</div>
					</div>
					<div>
						<div className="text-muted-foreground">Email</div>
						<div className="font-medium underline">
							<a href={`mailto:${apt.patient.email}`}>{apt.patient.email}</a>
						</div>
					</div>
					<div>
						<div className="text-muted-foreground">Sex</div>
						<div className="font-medium">{apt.patient.sex}</div>
					</div>
					<div>
						<div className="text-muted-foreground">Date of Birth</div>
						<div className="font-medium">{formatPureDatePretty(apt.patient.dob)}</div>
					</div>
					<div>
						<div className="text-muted-foreground">Added to {APP_NAME}</div>
						<div className="font-medium">{dateTimePretty(apt.patient.created_at)}</div>
					</div>
				</div>
			</fieldset>
			<fieldset className="grid gap-6 p-4 border rounded-lg">
				<legend className="px-1 -ml-1 text-sm font-medium">Assigned To</legend>
				<div className="grid gap-3 lg:grid-cols-2">
					<div>
						<div className="text-muted-foreground">Practioner</div>
						<div className="font-medium">
							{apt.assigned_to.first_name} {apt.assigned_to.last_name}
						</div>
					</div>
					<div>
						<div className="text-muted-foreground">Email</div>
						<div className="font-medium">{apt.assigned_to.email}</div>
					</div>
				</div>
			</fieldset>
		</div>
	);
}

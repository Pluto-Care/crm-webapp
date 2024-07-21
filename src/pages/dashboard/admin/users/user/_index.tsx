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
import {getSingleUserAPI} from "@/services/api/organization/admin/get_single_user";
import {useQuery} from "@tanstack/react-query";
import {Helmet} from "react-helmet";
import {Link, Navigate, useParams} from "react-router-dom";
import {PermissionsTab} from "./PermissionsTab";
import {HasPermission} from "@/contexts/auth";
import {
	MODIFY_ALL_AVAILABILITIES,
	MODIFY_USER_PERMISSIONS,
	VIEW_ALL_AVAILABILITIES,
} from "@/permissions/permissions";
import AddAvailabilityForm from "./availability/AddAvailability";
import UserAvailabilityList from "./availability/List";
import {timediff} from "@/lib/dateTimeUtils";
import UserDetails from "./user_details_tab/UserDetails";

export default function UserDetailPage() {
	const {user_id} = useParams();

	const user_query = useQuery({
		queryKey: ["user_detail", user_id],
		queryFn: () => (user_id ? getSingleUserAPI(user_id) : Promise.reject("No user id")),
		refetchOnWindowFocus: false,
		retry: false,
	});

	if (!user_id) {
		return <Navigate to="/dashboard/admin/users" />;
	}

	return (
		<DashboardLayout>
			{user_query.isLoading ? (
				<LoadingScreen message="Loading user..." />
			) : user_query.isSuccess ? (
				<>
					<Helmet>
						<title>
							User &mdash; {user_query.data?.user.first_name} {user_query.data?.user.last_name}{" "}
							&mdash; {APP_NAME}
						</title>
					</Helmet>
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>Admin Dashboard</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<Link to="/dashboard/admin/users">Users</Link>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbPage>
								{user_query.data?.user.first_name} {user_query.data?.user.last_name}
							</BreadcrumbPage>
						</BreadcrumbList>
					</Breadcrumb>

					<div className="flex mt-6 mb-5">
						<div className="flex-1">
							<h1 className="text-xl font-semibold md:text-2xl">
								{user_query.data?.user.first_name} {user_query.data?.user.last_name}
							</h1>
							<p className="!mt-1 text-sm text-muted-foreground">
								User &mdash; {user_query.data?.user.timezone}{" "}
								{timediff(user_query.data?.user.timezone)}
							</p>
						</div>
						<div></div>
					</div>
					<Tabs defaultValue="view" className="w-full my-4">
						<div className="relative flex items-start gap-8">
							<TabsList className="flex flex-col !h-auto min-w-64 sticky p-2 top-20">
								<TabsTrigger value="view" className="justify-start w-full">
									Details
								</TabsTrigger>
								<TabsTrigger value="permissions" className="justify-start w-full">
									Permissions
								</TabsTrigger>
								<TabsTrigger value="availability" className="justify-start w-full">
									Availability
								</TabsTrigger>
							</TabsList>
							<div className="flex-1">
								<div>
									<TabsContent value="view" className="!mt-0">
										{user_query.isSuccess && (
											<UserDetails
												user={user_query.data.user}
												created_by={user_query.data.created_by}
												updated_by={user_query.data.updated_by}
											/>
										)}
									</TabsContent>
									<TabsContent value="permissions" className="!mt-0">
										<HasPermission
											id={MODIFY_USER_PERMISSIONS}
											fallback={
												<ErrorMessageAlert
													title="Permission Denied"
													message="You do not have permission to modify user permissions."
												/>
											}
										>
											{user_query.isSuccess ? (
												<PermissionsTab
													permissions={user_query.data.permissions}
													role={user_query.data.role}
													user={user_query.data.user}
												/>
											) : (
												<></>
											)}
										</HasPermission>
									</TabsContent>
									<TabsContent value="availability" className="!mt-0">
										<HasPermission
											id={VIEW_ALL_AVAILABILITIES}
											fallback={
												<ErrorMessageAlert
													title="Permission Denied"
													message="You do not have permission to view availabilities."
												/>
											}
										>
											<HasPermission id={MODIFY_ALL_AVAILABILITIES} fallback={<></>}>
												<AddAvailabilityForm user={user_query.data.user} />
											</HasPermission>
											<UserAvailabilityList
												user_id={user_id}
												timezone={user_query.data.user.timezone}
											/>
										</HasPermission>
									</TabsContent>
								</div>
							</div>
						</div>
					</Tabs>
				</>
			) : user_query.isError ? (
				<ErrorMessageAlert
					title="Failed to load data"
					message={`Try refreshing the page or go back to the previous page and try again. [${user_query.error}]`}
				/>
			) : null}
		</DashboardLayout>
	);
}

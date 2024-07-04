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
import {UserType} from "@/types/user";
import {Label} from "@radix-ui/react-dropdown-menu";
import {useQuery} from "@tanstack/react-query";
import {Helmet} from "react-helmet";
import {Link, Navigate, useParams} from "react-router-dom";
import {PermissionsTab} from "./PermissionsTab";
import {HasPermission} from "@/contexts/auth";
import {MODIFY_USER_PERMISSIONS} from "@/permissions/permissions";
import AddAvailabilityForm from "./availability/AddAvailability";
import spacetime from "spacetime";
import UserAvailabilityList from "./availability/List";

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

	function timediff(timezone: string) {
		const here = spacetime.now();
		const here_offset = here.timezone().current.offset;
		const there_offset = here.goto(timezone).timezone().current.offset;
		const diff = there_offset - here_offset; // eg. 3 or 11.5 or -4
		const hours = Math.floor(diff);
		const minutes = Math.round((diff - hours) * 60);
		const is_ahead = diff > 0;
		if (hours === 0 && minutes === 0) {
			return "";
		} else if (hours > 0 && minutes === 0) {
			return (
				"(" + hours + " hour" + (hours > 1 ? "s" : "") + (is_ahead ? " ahead" : " behind") + ")"
			);
		} else if (hours === 0 && minutes > 0) {
			return (
				"(" +
				minutes +
				" minute" +
				(minutes > 1 ? "s" : "") +
				(is_ahead ? " ahead" : " behind") +
				")"
			);
		} else if (hours > 0 && minutes > 0) {
			return (
				"(" + hours + " hours " + minutes + " minutes" + (is_ahead ? " ahead" : " behind") + ")"
			);
		}
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
										{user_query.isSuccess && <UserDetails user={user_query.data.user} />}
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
										<AddAvailabilityForm user={user_query.data.user} />
										<UserAvailabilityList
											user_id={user_id}
											timezone={user_query.data.user.timezone}
										/>
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

function UserDetails({user}: {user: UserType}) {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
			<div>
				<Label>First Name</Label>
				<div>{user.first_name}</div>
			</div>
			<div>
				<Label>Last Name</Label>
				<div>{user.last_name}</div>
			</div>
			<div>
				<Label>Email</Label>
				<div>{user.email}</div>
			</div>
		</div>
	);
}

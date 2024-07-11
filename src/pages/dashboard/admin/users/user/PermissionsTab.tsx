import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {FormField} from "@/components/ui/form";
import {
	APPOINTMENT_PERMISSIONS,
	CALL_PERMISSIONS,
	CustomPermissionType,
	LOGS_PERMISSIONS,
	ORGANIZATION_PERMISSIONS,
	PATIENT_PERMISSIONS,
	SCHEDULING_PERMISSIONS,
	USER_PERMISSIONS,
} from "@/permissions/permissions";
import {modifyUserPermissionsAPI} from "@/services/api/organization/admin/modify_user_permissions";
import {UserPermissions, UserRole, UserType} from "@/types/user";
import {useMutation} from "@tanstack/react-query";
import {CheckCircle, Loader2, XCircleIcon} from "lucide-react";
import {useForm} from "react-hook-form";
import {toast} from "sonner";

export interface IPermissionsTabProps {
	permissions: UserPermissions | undefined | null;
	role: UserRole | undefined | null;
	user: UserType;
}

export function PermissionsTab(props: IPermissionsTabProps) {
	const form = useForm({
		defaultValues: props.permissions?.reduce((acc, perm) => {
			acc[perm.id] = true;
			return acc;
		}, {} as Record<string, boolean>),
	});

	const mutation = useMutation({
		mutationKey: ["update_user_permissions"],
		mutationFn: (data: {permissions: string[]; user_id: string}) => modifyUserPermissionsAPI(data),
		onSuccess: () => {
			toast("Done", {
				description: "Permissions updated successfully",
				icon: <CheckCircle className="w-5 h-5" />,
				position: "top-right",
				invert: true,
			});
		},
		onError: (error) => {
			toast("Error", {
				description: error.message,
				icon: <XCircleIcon className="w-5 h-5" />,
				position: "top-right",
			});
		},
	});

	const onSubmit = (data: {[key: string]: boolean | undefined}) => {
		// Handle form submission here
		// Remove undefined and false values
		data = Object.fromEntries(Object.entries(data).filter(([, value]) => value));
		// Get a list of only keys
		const permission_ids = Object.keys(data);
		mutation.mutate({
			permissions: permission_ids,
			user_id: props.user.id,
		});
	};

	return (
		<div className="relative flex-col items-start hidden gap-8 md:flex">
			<form className="grid items-start w-full gap-6" onSubmit={form.handleSubmit(onSubmit)}>
				<fieldset
					disabled={mutation.isPending}
					className="grid gap-6 p-4 border border-red-300 rounded-lg dark:border-red-400/50"
				>
					<legend className="px-1 -ml-1 text-sm font-medium">Administrator</legend>
					<div className="grid gap-3">
						{[
							{
								id: "full_access",
								name: "Full Admin Access",
								description: "This is equivalent to the role of Super Admin.",
							},
						].map((permission) => {
							return (
								<PermissionFormField key={permission.id} form={form} permission={permission} />
							);
						})}
					</div>
				</fieldset>
				<div className="relative flex flex-col">
					<div className="grid items-start flex-1 w-full gap-6">
						<PermissionSection
							form={form}
							title="User Handling"
							permissions={USER_PERMISSIONS}
							user_perms={props.permissions}
						/>
						<PermissionSection
							form={form}
							title="Patient Handling"
							permissions={PATIENT_PERMISSIONS}
							user_perms={props.permissions}
						/>
						<PermissionSection
							form={form}
							title="Organization Handling"
							permissions={ORGANIZATION_PERMISSIONS}
							user_perms={props.permissions}
						/>
						<PermissionSection
							form={form}
							title="Appointments"
							permissions={APPOINTMENT_PERMISSIONS}
							user_perms={props.permissions}
						/>
						<PermissionSection
							form={form}
							title="Calling"
							permissions={CALL_PERMISSIONS}
							user_perms={props.permissions}
						/>
						<PermissionSection
							form={form}
							title="Scheduling"
							permissions={SCHEDULING_PERMISSIONS}
							user_perms={props.permissions}
							description="User always have access to change their own availability. These permissions are for admins to view and modify other staff's availability."
						/>
						<PermissionSection
							form={form}
							title="Miscellaneous"
							permissions={LOGS_PERMISSIONS}
							user_perms={props.permissions}
						/>
					</div>
					<div className="w-full pt-4 pb-2 mt-4 bg-gradient-to-b from-transparent to-background">
						<Button disabled={mutation.isPending} className="w-full">
							{mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
							Save Permissions
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
}

function PermissionSection({
	form,
	title,
	permissions,
	description,
}: {
	form: ReturnType<typeof useForm>;
	title: string;
	permissions: CustomPermissionType[];
	user_perms: UserPermissions | undefined | null;
	description?: string;
}) {
	return (
		<fieldset className="grid gap-6 p-4 border rounded-lg">
			<legend className="px-1 -ml-1 text-sm font-medium">{title}</legend>
			{description && <p className="text-sm !mt-0 text-muted-foreground">{description}</p>}
			<div className="grid gap-3 xl:grid-cols-3">
				{permissions.map((permission) => {
					return <PermissionFormField key={permission.id} form={form} permission={permission} />;
				})}
			</div>
		</fieldset>
	);
}

function PermissionFormField({
	form,
	permission,
}: {
	form: ReturnType<typeof useForm>;
	permission: CustomPermissionType;
}) {
	return (
		<div className="flex m-2 space-x-2 items-top">
			<FormField
				control={form.control}
				name={permission.id}
				render={({field}) => (
					<Checkbox checked={field.value} onCheckedChange={field.onChange} id={permission.id} />
				)}
			/>
			<div className="flex flex-col gap-2 leading-none">
				<label
					htmlFor={permission.id}
					className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					{permission.name}
				</label>
				{permission.description && (
					<p className="text-sm text-muted-foreground !mt-0">{permission.description}</p>
				)}
			</div>
		</div>
	);
}

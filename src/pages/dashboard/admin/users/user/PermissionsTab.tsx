import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {
	CustomPermissionType,
	LOGS_PERMISSIONS,
	ORGANIZATION_PERMISSIONS,
	PATIENT_PERMISSIONS,
	USER_PERMISSIONS,
} from "@/permissions/permissions";
import {UserPermissions, UserRole} from "@/types/user";

export interface IPermissionsTabProps {
	permissions: UserPermissions | undefined | null;
	role: UserRole | undefined | null;
}

export function PermissionsTab(props: IPermissionsTabProps) {
	return (
		<div className="relative flex-col items-start hidden gap-8 md:flex">
			<form className="grid items-start w-full gap-6">
				<fieldset className="grid gap-6 p-4 border border-red-300 rounded-lg dark:border-red-400/50">
					<legend className="px-1 -ml-1 text-sm font-medium">Admin Portal</legend>
					<div className="grid gap-3">
						{[{id: "full_access", name: "Full Admin Access"}].map((permission) => {
							const hasPermission = props.permissions?.find((p) => p.id === permission.id);
							return (
								<div key={permission.id} className="flex space-x-2 items-top">
									<Checkbox
										id={permission.id}
										defaultChecked={hasPermission ? true : false}
										name={permission.id}
									/>
									<div className="grid gap-1.5 leading-none">
										<label
											htmlFor={permission.id}
											className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
										>
											{permission.name}
										</label>
										<p className="text-sm text-muted-foreground !mt-0">
											This is equivalent to the role of Super Admin.
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</fieldset>
			</form>
			<form className="grid items-start w-full gap-6">
				<PermissionSection
					title="User Handling"
					permissions={USER_PERMISSIONS}
					user_perms={props.permissions}
				/>
				<PermissionSection
					title="Patient Handling"
					permissions={PATIENT_PERMISSIONS}
					user_perms={props.permissions}
				/>
				<PermissionSection
					title="Organization Handling"
					permissions={ORGANIZATION_PERMISSIONS}
					user_perms={props.permissions}
				/>
				<PermissionSection
					title="Logs"
					permissions={LOGS_PERMISSIONS}
					user_perms={props.permissions}
				/>
				<Button>Save Permissions</Button>
			</form>
		</div>
	);
}

function PermissionSection({
	title,
	permissions,
	user_perms,
}: {
	title: string;
	permissions: CustomPermissionType[];
	user_perms: UserPermissions | undefined | null;
}) {
	return (
		<fieldset className="grid gap-6 p-4 border rounded-lg">
			<legend className="px-1 -ml-1 text-sm font-medium">{title}</legend>
			<div className="grid gap-3 xl:grid-cols-3">
				{permissions.map((permission) => {
					const hasPermission = user_perms?.find((p) => p.id === permission.id);
					return (
						<div key={permission.id} className="flex m-2 space-x-2 items-top">
							<Checkbox
								id={permission.id}
								defaultChecked={hasPermission ? true : false}
								name={permission.id}
							/>
							<div className="grid gap-1.5 leading-none">
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
				})}
			</div>
		</fieldset>
	);
}

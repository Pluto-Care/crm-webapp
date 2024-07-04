// PATIENT

export const READ_ALL_PATIENTS = "read:all_patients";
export const CREATE_PATIENTS = "create:patients";
export const UPDATE_PATIENTS = "update:patients";
export const DELETE_PATIENTS = "delete:patients";

// SCHEDULING

export const MODIFY_ALL_APPOINTMENTS = "modify:appointments";
export const VIEW_ALL_APPOINTMENTS = "view:appointments";
export const MODIFY_ALL_AVAILABILITIES = "modify:all_availabilities";
export const VIEW_ALL_AVAILABILITIES = "view:all_availabilities";
export const MODIFY_ALL_BREAKS = "modify:all_breaks";
export const VIEW_ALL_BREAKS = "view:all_breaks";
export const MODIFY_ALL_LEAVES = "modify:all_leaves";
export const VIEW_ALL_LEAVES = "view:all_leaves";

// BASE

export const FULL_ACCESS = "full_access";
export const CREATE_USERS = "create:new_user";
export const UPDATE_USER_PROFILE = "update:user";
export const DELETE_USER = "delete:user";
export const DELETE_USER_MFA = "delete:user_mfa";
export const UPDATE_USER_MFA = "update:user_mfa";
export const UPDATE_USER_PASSWORD = "update:user_password";
export const DISABLE_USER = "disable:user";
export const ENABLE_USER = "enable:user";
export const UPDATE_ORGANIZATION = "update:organization";
export const READ_ALL_LOGS = "read:all_logs";
export const READ_ALL_USERS = "read:all_users";
export const MODIFY_USER_ROLE = "update:user_role";
export const MODIFY_USER_PERMISSIONS = "update:user_permissions";

// Catgeorized permissions

export type CustomPermissionType = {
	id: string;
	name: string;
	description?: string;
};

export const PATIENT_PERMISSIONS: CustomPermissionType[] = [
	{
		id: READ_ALL_PATIENTS,
		name: "Read all patients",
		description: "This is an Admin level permission to read everything about patients.",
	},
	{id: CREATE_PATIENTS, name: "Create patients"},
	{id: UPDATE_PATIENTS, name: "Update patient profiles"},
	{id: DELETE_PATIENTS, name: "Delete patients"},
];

export const USER_PERMISSIONS: CustomPermissionType[] = [
	{
		id: READ_ALL_USERS,
		name: "Read all users",
		description: "This is an Admin level permission to read everything about users.",
	},
	{id: CREATE_USERS, name: "Create new user"},
	{id: UPDATE_USER_PROFILE, name: "Update user"},
	{id: DELETE_USER, name: "Delete user"},
	{id: DELETE_USER_MFA, name: "Delete user MFA"},
	{id: UPDATE_USER_MFA, name: "Update user MFA"},
	{
		id: UPDATE_USER_PASSWORD,
		name: "Update user password",
		description: "User always have access to change their own password.",
	},
	{id: DISABLE_USER, name: "Disable user"},
	{id: ENABLE_USER, name: "Enable user"},
	{id: MODIFY_USER_ROLE, name: "Update user role"},
	{id: MODIFY_USER_PERMISSIONS, name: "Update user permissions"},
];

export const ORGANIZATION_PERMISSIONS: CustomPermissionType[] = [
	{id: UPDATE_ORGANIZATION, name: "Update organization"},
];

export const LOGS_PERMISSIONS: CustomPermissionType[] = [
	{id: READ_ALL_LOGS, name: "Read all logs"},
];

export const APPOINTMENT_PERMISSIONS: CustomPermissionType[] = [
	{
		id: MODIFY_ALL_APPOINTMENTS,
		name: "Make or Modify appointments",
		description:
			"User can always make an appointment for themselves. This permission is for Admins to make appointments for anyone.",
	},
	{
		id: VIEW_ALL_APPOINTMENTS,
		name: "Read all appointments",
		description:
			"User can always view their own appointments. This permission is for Admins to view all appointments.",
	},
];

export const SCHEDULING_PERMISSIONS: CustomPermissionType[] = [
	{
		id: MODIFY_ALL_AVAILABILITIES,
		name: "Modify all availabilities",
	},
	{
		id: VIEW_ALL_AVAILABILITIES,
		name: "View all availabilities",
	},
	{
		id: MODIFY_ALL_BREAKS,
		name: "Modify all breaks",
	},
	{id: VIEW_ALL_BREAKS, name: "View all breaks"},
	{
		id: MODIFY_ALL_LEAVES,
		name: "Modify all leaves",
		description: "This is an Admin level permission",
	},
	{id: VIEW_ALL_LEAVES, name: "View all leaves"},
];

export type UserType = {
	id: string;
	is_active: boolean;
	created_at: string;
	first_name: string;
	last_name: string;
	updated_at: string;
	email: string;
	timezone: string;
	created_by: string | null;
	updated_by: string | null;
};

export type UserRole = {
	id: string;
	name: string;
	permissions: string[];
};

export type UserPermissions = {id: string; name: string}[];

export type UserPasswordChangeType = {
	date_last_changed_by_user: string | null;
	date_last_changed_by_admin: string | null;
	last_changed_by_admin: string | null;
	last_pswd_change_method_by_user: string | null;
	pswd_change_lock_til: string | null;
};

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

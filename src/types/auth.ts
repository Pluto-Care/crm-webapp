export type AuthUserType = {
	id: string;
	is_admin: boolean;
	is_active: boolean;
	created_at: string;
	first_name: string;
	last_name: string;
	updated_at: string;
	email: string;
	created_by: string | null;
	updated_by: string | null;
};

export type AuthUserLastTokenSessionType = {
	id: string;
	is_valid: boolean;
	created_at: string;
	ip: string;
	ua: string;
};

export type AuthUserLastWebSessionType = {
	id: string;
	is_valid: boolean;
	created_at: string;
	updated_at: string;
	ip: string;
	ua: string;
};

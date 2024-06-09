export type OrgType = {
	name: string;
	email: string;
	phone: string;
	street: string;
	city: string;
	state: string;
	country: string;
	postal_code: string;
	organization: string;
	created_at: string;
	updated_at: string;
	updated_by: string;
};

export type OrgUser = {
	id: string;
	is_active: boolean;
	created_at: string;
	first_name: string;
	last_name: string;
	updated_at: string;
	email: string;
	created_by: string | null;
	updated_by: string | null;
};

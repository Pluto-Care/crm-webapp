import {UserType} from "./user";

export type PatientType = {
	id: string;
	first_name: string;
	last_name: string;
	dob: string;
	sex: string;
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
	created_by: string;
};

export type PatientNoteType = {
	id: string;
	note: string;
	created_at: string;
	created_by: UserType;
	patient: string;
	updated_at: string | null;
	updated_by: UserType | null;
};

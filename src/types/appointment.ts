export type AppointmentType = {
	id: string;
	patient: {
		id: string;
		first_name: string;
		last_name: string;
		phone: string;
		email: string;
	};
	start_at: string;
	end_at: string;
	reason: string;
	status: string;
	assigned_to: {
		id: string;
		first_name: string;
		last_name: string;
	};
	created_at: string;
	updated_at: string;
	created_by: {
		id: string;
		first_name: string;
		last_name: string;
	};
	updated_by: {
		id: string;
		first_name: string;
		last_name: string;
	};
	organization: string;
};

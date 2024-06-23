import axios from "axios";
import {API_URL} from "@/config";
import {AppointmentType} from "@/types/appointment";
import {UserType} from "@/types/user";
import {PatientType} from "@/types/patient";

export type MySingleAppointmentType = {
	appointment: AppointmentType;
	created_by: UserType;
	updated_by: UserType;
	assigned_to: UserType;
	patient: PatientType;
};

/**
 *
 * @returns Promise
 *
 */
export function getMySingleAppointmentAPI(appointment_id: string) {
	return axios
		.get(API_URL + "/api/scheduling/appointments/my/list/" + appointment_id + "/", {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((response) => {
			return response.data.data as MySingleAppointmentType;
		});
}

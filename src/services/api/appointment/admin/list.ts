import axios from "axios";
import {API_URL} from "@/config";
import {AppointmentType} from "@/types/appointment";

/**
 *
 * @returns Promise
 *
 */
export function getOrgAppointmentListAPI() {
	return axios
		.get(API_URL + "/api/scheduling/appointments/admin/list/", {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((response) => {
			return response.data.data as AppointmentType[];
		});
}

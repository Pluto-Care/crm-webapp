import axios from "axios";
import {API_URL} from "@/config";
import {AppointmentType} from "@/types/appointment";

/**
 *
 * @returns Promise
 *
 */
export function getMyAppointmentListAPI() {
	return axios
		.get(API_URL + "/api/appointment/my/", {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((response) => {
			return response.data.data as AppointmentType[];
		});
}

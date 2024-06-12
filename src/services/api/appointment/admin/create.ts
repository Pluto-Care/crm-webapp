import axios from "axios";
import {API_URL} from "@/config";
import {AppointmentType} from "@/types/appointment";

/**
 *
 * @param appointment - AppointmentType
 * @returns Promise
 *
 */
export function createAppointmentAPI(appointment: AppointmentType) {
	return axios
		.post(API_URL + "/api/appointment/new/", appointment, {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((res) => {
			return res.data.data as AppointmentType;
		});
}

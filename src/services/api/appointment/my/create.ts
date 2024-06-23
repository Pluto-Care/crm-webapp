import axios from "axios";
import {API_URL} from "@/config";
import {AppointmentType} from "@/types/appointment";

export type MyCreateAppointmentType = {
	patient: string;
	start_time: string;
	duration: number;
	date: Date;
	status: "confirmed" | "cancelled" | "completed" | "rescheduled";
	type: "in-person" | "video" | "phone";
	reason: string;
	assigned_to: string;
};

/**
 *
 * @param appointment - CreateAppointmentType
 * @returns Promise
 *
 */
export function createMyAppointmentAPI(appointment: MyCreateAppointmentType) {
	return axios
		.post(API_URL + "/api/scheduling/appointments/my/new/", appointment, {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((res) => {
			return res.data.data as AppointmentType;
		});
}

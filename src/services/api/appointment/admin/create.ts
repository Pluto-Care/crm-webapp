import axios from "axios";
import {API_URL} from "@/config";
import {AppointmentType} from "@/types/appointment";

export type CreateAppointmentType = {
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
export function createAppointmentAPI(appointment: CreateAppointmentType) {
	return axios
		.post(API_URL + "/api/scheduling/appointments/admin/new/", appointment, {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((res) => {
			return res.data.data as AppointmentType;
		});
}

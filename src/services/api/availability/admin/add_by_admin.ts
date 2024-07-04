import axios from "axios";
import {API_URL} from "@/config";
import {AvailabilityType} from "@/types/availability";

/**
 *
 * @param appointment - CreateAppointmentType
 * @returns Promise
 *
 */
export function addAvailabilityAPI(details: unknown) {
	return axios
		.post(API_URL + "/api/scheduling/availabilities/admin/new/", details, {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((res) => {
			return res.data.data as AvailabilityType[];
		});
}

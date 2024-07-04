import axios from "axios";
import {API_URL} from "@/config";
import {AvailabilityType} from "@/types/availability";

/**
 * Admin function
 * @returns Promise
 *
 */
export function getUserAvailabilityListAPI(user_id: string) {
	return axios
		.get(API_URL + "/api/scheduling/availabilities/admin/" + user_id + "/list/", {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((response) => {
			return response.data.data as AvailabilityType[];
		});
}

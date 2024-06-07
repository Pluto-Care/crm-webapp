import axios from "axios";
import {API_URL} from "@/config";
import {Patient} from "@/types/patient";

/**
 *
 * @returns Promise
 *
 */
export function getOrgPatientListAPI() {
	return axios
		.get(API_URL + "/api/patient/list/", {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((response) => {
			return response.data.data as Patient[];
		});
}

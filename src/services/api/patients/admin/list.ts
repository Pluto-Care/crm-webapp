import axios from "axios";
import {API_URL} from "@/config";
import {PatientType} from "@/types/patient";

/**
 *
 * @returns Promise
 *
 */
export function getOrgPatientListAPI() {
	return axios
		.get(API_URL + "/api/patients/list/", {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((response) => {
			return response.data.data as PatientType[];
		});
}

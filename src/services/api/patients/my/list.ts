import axios from "axios";
import {API_URL} from "@/config";
import {PatientType} from "@/types/patient";

/**
 *
 * @returns Promise
 *
 */
export function getMyPatientListAPI() {
	return axios
		.get(API_URL + "/api/scheduling/appointments/my/patients/", {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((response) => {
			return response.data.data as PatientType[];
		});
}

import axios from "axios";
import {API_URL} from "@/config";
import {PatientType} from "@/types/patient";

/**
 *
 * @param patient_id - string
 * @returns Promise
 *
 */
export function getPatientAPI(patient_id: string) {
	return axios
		.get(API_URL + "/api/patient/id/" + patient_id + "/", {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((response) => {
			return response.data.data as PatientType;
		});
}

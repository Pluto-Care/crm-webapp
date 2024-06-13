import axios from "axios";
import {API_URL} from "@/config";
import {PatientType} from "@/types/patient";

/**
 *
 * @param patient - PatientType
 * @returns Promise
 *
 */
export function createPatientAPI(patient: PatientType) {
	return axios
		.post(API_URL + "/api/patient/new/", patient, {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((res) => {
			return res.data;
		});
}

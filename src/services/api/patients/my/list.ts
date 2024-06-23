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
			const list = response.data.data as PatientType[];
			// TODO: [ONLY needed as distinct does not work with SQLite]
			// remove duplicate ids
			const uniqueList = list.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
			return uniqueList;
		});
}

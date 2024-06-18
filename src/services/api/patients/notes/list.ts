import axios from "axios";
import {API_URL} from "@/config";
import {PatientNoteType} from "@/types/patient";

/**
 *
 * @param patient_id - string
 * @returns Promise
 *
 */
export function getAllPatientNotesAPI({patient_id}: {patient_id: string}) {
	return axios
		.get(API_URL + `/api/patients/list/${patient_id}/notes/`, {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((response) => {
			return response.data.data as PatientNoteType[];
		});
}

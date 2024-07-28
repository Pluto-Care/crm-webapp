import axios from "axios";
import {API_URL} from "@/config";
import {PatientNoteType} from "@/types/patient";

/**
 *
 * @param patient_id - string
 * @param note_text - string
 * @returns Promise
 *
 */
export function createPatientNoteAPI({
	patient_id,
	note_text,
}: {
	patient_id: string;
	note_text: string;
}) {
	return axios
		.post(
			API_URL + `/api/patients/list/${patient_id}/notes/general/new/`,
			{
				note: note_text,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
				withCredentials: true,
			}
		)
		.then((res) => {
			return res.data.data as PatientNoteType;
		});
}

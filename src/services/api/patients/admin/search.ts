import axios from "axios";
import {API_URL} from "@/config";

export type SearchPatientResponseType = {
	id: string;
	first_name: string;
	last_name: string;
	phone: string;
	city: string;
	state: string;
};

/**
 *
 * @param keyword - string
 * @returns Promise
 *
 */
export async function searchPatientAPI(keyword: string) {
	const res = await axios.post(
		API_URL + "/api/patients/search/",
		{keyword: keyword},
		{
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		}
	);
	return res.data.data as SearchPatientResponseType[];
}

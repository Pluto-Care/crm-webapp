import axios from "axios";
import {API_URL} from "@/config";
import {UserType} from "@/types/user";

/**
 *
 * @param keyword - string
 * @returns Promise
 *
 */
export async function searchOrgUserAPI(keyword: string) {
	const res = await axios.post(
		API_URL + "/api/organization/users/search/",
		{keyword: keyword},
		{
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		}
	);
	return res.data.data as UserType[];
}

import axios from "axios";
import {API_URL} from "@/config";

/**
 *
 * @param user_id - string
 * @returns Promise
 *
 */
export function disableUserAccountAPI(user_id: string) {
	return axios.post(
		API_URL + "/api/organization/manage/users/" + user_id + "/disable_user/",
		{},
		{
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		}
	);
}

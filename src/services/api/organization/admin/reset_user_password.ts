import axios from "axios";
import {API_URL} from "@/config";

/**
 *
 * @param user_id - string
 * @param new_password - string
 * @returns Promise
 *
 */
export function resetUserPasswordAPI(user_id: string, new_password: string) {
	// TODO: Add functionality to make user reset their password on next login
	return axios.post(
		API_URL + "/api/organization/manage/users/" + user_id + "/reset_password/",
		{new_password: new_password},
		{
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		}
	);
}

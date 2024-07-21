import axios from "axios";
import {API_URL} from "@/config";

export type UpdateUserProfileSchema = {
	email: string;
	timezone: string;
	is_active: boolean;
	first_name: string;
	last_name: string;
};

/**
 *
 * @param permissions - {permissions: string[], user_id: string}
 * @returns Promise
 *
 */
export function updateUserProfileByAdminAPI(user_id: string, data: UpdateUserProfileSchema) {
	return axios.post(
		API_URL + "/api/organization/manage/users/" + user_id + "/update_profile/",
		data,
		{
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		}
	);
}

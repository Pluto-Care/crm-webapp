import axios from "axios";
import {API_URL} from "@/config";
import {UserPermissions, UserRole, UserType} from "@/types/user";
import {APIErrorResponse} from "@/types/api";

/**
 *
 * @param user_id - string
 * @returns Promise
 *
 */
export function getSingleUserAPI(user_id: string) {
	return axios
		.get(API_URL + "/api/organization/manage/users/" + user_id + "/", {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((response) => {
			return response.data.data as {
				user: UserType;
				permissions?: UserPermissions;
				role?: UserRole;
				created_by: UserType | null;
				updated_by: UserType | null;
			};
		})
		.catch((error) => {
			throw error.data as APIErrorResponse;
		});
}

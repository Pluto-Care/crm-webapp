import axios from "axios";
import {API_URL} from "@/config";

/**
 *
 * @param permissions - {permissions: string[], user_id: string}
 * @returns Promise
 *
 */
export function modifyUserPermissionsAPI(permissions: {permissions: string[]; user_id: string}) {
	return axios.post(API_URL + "/api/role/update_permissions/", permissions, {
		headers: {
			"Content-Type": "application/json",
		},
		withCredentials: true,
	});
}

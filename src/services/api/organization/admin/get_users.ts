import axios from "axios";
import {API_URL} from "@/config";
import {OrgUser} from "@/types/org";

/**
 *
 * @returns Promise
 *
 */
export function getOrgUsersAPI() {
	return axios
		.get(API_URL + "/api/organization/users/", {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((response) => {
			return response.data.data as OrgUser[];
		});
}

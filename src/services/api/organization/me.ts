import axios from "axios";
import {API_URL} from "@/config";
import {OrgType} from "@/types/org";

/**
 *
 * @returns Promise
 *
 */
export function getMyOrgAPI() {
	return axios
		.get(API_URL + "/api/organization/me/", {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((response) => {
			return response.data.data as OrgType;
		});
}

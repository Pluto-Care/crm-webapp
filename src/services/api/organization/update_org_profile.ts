import axios from "axios";
import {API_URL} from "@/config";

export type UpdateOrgProfileAPIType = {
	name: string;
	email: string;
	phone: string | number;
	street: string;
	city: string;
	state: string;
	country: string;
	postal_code: string;
};

/**
 *
 * @param payload - UpdateOrgProfileAPIType
 * @returns Promise
 *
 */
export function updateOrgProfileAPI(payload: UpdateOrgProfileAPIType) {
	return axios.put(API_URL + "/api/organization/me/", payload, {
		headers: {
			"Content-Type": "application/json",
		},
		withCredentials: true,
	});
}

import axios from "axios";
import {API_URL} from "@/config";

export type CreateOrgProfileType = {
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
 * @param payload - CreateOrgProfileType
 * @returns Promise
 *
 */
export function createOrgProfileAPI(payload: CreateOrgProfileType) {
	return axios.post(API_URL + "/api/organization/me/", payload, {
		headers: {
			"Content-Type": "application/json",
		},
		withCredentials: true,
	});
}

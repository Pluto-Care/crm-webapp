import axios from "axios";
import {API_URL} from "@/config";
import {UserType} from "@/types/user";

export type CreateUserType = {
	first_name: string;
	last_name: string;
	email: string;
	password: string;
};

/**
 *
 * @param user - CreateUserType
 * @returns Promise
 *
 */
export function createUserAPI(user: CreateUserType) {
	return axios
		.post(API_URL + "/api/organization/manage/user/create/", user, {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((res) => {
			return res.data.data as UserType;
		});
}

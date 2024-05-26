import axios from "axios";
import {API_URL} from "@/config";

/**
 *
 * @param email Some email
 * @param password Password
 * @returns Promise
 *
 */
export function loginAPI(email: string, password: string) {
	return axios
		.post(
			API_URL + "/api/user/login/",
			{
				email: email,
				password: password,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
				withCredentials: true,
			}
		)
		.then((res) => {
			return res.data;
		});
}

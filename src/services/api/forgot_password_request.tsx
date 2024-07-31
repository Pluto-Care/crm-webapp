import axios from "axios";
import {API_URL} from "@/config";

/**
 *
 * @param email Some email
 * @returns Promise
 *
 */
export function forgotPasswordRequestAPI(email: string) {
	return axios
		.post(
			API_URL + "/api/user/forgot_password/request/",
			{
				email: email,
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

import axios from "axios";
import {API_URL} from "@/config";

/**
 *
 * @param password Some password
 * @param key Password reset key
 * @returns Promise
 *
 */
export function resetPasswordAPI(password: string, key: string) {
	return axios
		.post(
			API_URL + "/api/user/forgot_password/reset/",
			{
				password: password,
				key: key,
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

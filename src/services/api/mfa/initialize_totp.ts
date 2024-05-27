import axios from "axios";
import {API_URL} from "@/config";

/**
 *
 * @param token MFA Join Token
 * @returns Promise
 *
 */
export function mfaJoinAPI(token: string) {
	return axios
		.post(
			API_URL + "/api/user/totp/init/",
			{
				mfa_join_token: token,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
				withCredentials: true,
			}
		)
		.then((res) => {
			return res.data as {key: string; backup_codes: string[]; provision: string};
		});
}

import axios from "axios";
import {API_URL} from "@/config";

/**
 *
 * @param mfa_join_token MFA Join Token
 * @param token TOTP Token
 * @returns Promise
 *
 */
export function mfaEnableAPI(mfa_join_token: string, token: string) {
	// Returns 204 No Content on success
	return axios.post(
		API_URL + "/api/user/totp/enable/",
		{
			mfa_join_token: mfa_join_token,
			token: token,
		},
		{
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		}
	);
}

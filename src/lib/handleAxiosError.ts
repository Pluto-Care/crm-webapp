import {AxiosError} from "axios";
import {Dispatch, SetStateAction} from "react";

export interface ErrorType {
	code: null;
	detail: string | {[key: string]: string | boolean | number | []} | AxiosRequestErrorDetail | null;
	instance: string;
	status: number;
	title: string;
}

export interface AxiosRequestErrorDetail {
	url: string | undefined;
	method: string | undefined;
	withCredentials: boolean | undefined;
}

export function handleAxiosError(
	error: AxiosError,
	setReqError: Dispatch<SetStateAction<ErrorType | null>>
) {
	const msg = error.response?.data;
	try {
		const res = msg as ErrorType;
		if (res) {
			setReqError(res);
		} else {
			throw new Error("Unknown error");
		}
	} catch (e) {
		// Status 0 is always network error
		const errorDetail: AxiosRequestErrorDetail = {
			url: error.config?.url,
			method: error.config?.method,
			withCredentials: error.config?.withCredentials,
		};
		setReqError({
			code: null,
			detail: errorDetail,
			instance: error.config?.url ?? "",
			status: 0,
			title: JSON.stringify(error.message).replaceAll('"', ""),
		});
	}
}

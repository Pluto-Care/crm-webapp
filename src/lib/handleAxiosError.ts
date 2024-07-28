import {DefaultError} from "@tanstack/react-query";
import {AxiosError} from "axios";
import {Dispatch, SetStateAction} from "react";

export interface AxiosTqError extends DefaultError, AxiosError<any> {}

export interface ErrorType {
	id: string;
	data: null;
	errors: {
		code: string | null;
		detail: any;
		instance: string;
		title: string;
	};
	status: number;
	success: boolean;
}

export interface AxiosRequestErrorDetail {
	url: string | undefined;
	method: string | undefined;
	withCredentials: boolean | undefined;
}

export function handleAxiosError(
	error: AxiosError,
	setReqError?: Dispatch<SetStateAction<ErrorType | null>>
) {
	const msg = error.response?.data;
	try {
		const res = msg as ErrorType;
		if (res) {
			if (setReqError) {
				setReqError(res);
			} else {
				return res;
			}
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
		const err_val = {
			code: null,
			detail: errorDetail,
			instance: error.config?.url ?? "",
			status: 0,
			title: JSON.stringify(error.message).replaceAll('"', ""),
			id: "NetworkError",
		};
		if (setReqError) {
			setReqError(err_val);
		} else {
			return err_val;
		}
	}
}

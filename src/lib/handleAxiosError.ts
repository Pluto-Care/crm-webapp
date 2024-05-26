import {AxiosError} from "axios";
import {Dispatch, SetStateAction} from "react";

export interface ErrorType {
	code: null;
	detail: string | {[key: string]: string | string[]} | null;
	instance: string;
	status: number;
	title: string;
}

export function handleAxiosError(
	error: AxiosError,
	setReqError: Dispatch<SetStateAction<ErrorType | null>>
) {
	const msg = error.response?.data;
	try {
		const res = msg as ErrorType;
		setReqError(res);
	} catch (err) {
		setReqError({
			code: null,
			detail: JSON.stringify(error.message).replaceAll('"', ""),
			instance: "",
			status: 0,
			title: JSON.stringify(error.message).replaceAll('"', ""),
		});
	}
}

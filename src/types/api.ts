/**
 * Type for `post` object we get from API.
 */
export interface PostType {
	userId: number;
	id: number;
	title: string;
	body: string;
}

export type APIErrorResponse = {
	success: boolean;
	data: null;
	error: {
		title: string;
		detail: unknown;
		instance: string;
		code: string;
	};
	status: number;
	id?: string;
};

import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {resetUserPasswordAPI} from "@/services/api/organization/admin/reset_user_password";
import {Loader2, RefreshCcw} from "lucide-react";
import {Checkbox} from "@/components/ui/checkbox";
import {ErrorMessageAlert} from "@/components/utils/ErrorMessageAlert";
import {AxiosTqError} from "@/lib/handleAxiosError";

function generatePassword() {
	const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ";
	const lowercase = "abcdefghijkmnopqrstuvwxyz";
	const numbers = "123456789";
	const symbols = "!@#$%^&*_+=";

	const all = uppercase + lowercase + numbers + symbols;

	let password = "";
	for (let i = 0; i < 8; i++) {
		password += all[Math.floor(Math.random() * all.length)];
	}

	const used_indexes: number[] = [];
	// atleast one uppercase, lowercase, number and symbol inserted randomly
	for (let i = 0; i < 4; i++) {
		let random_char = "";
		if (i === 0) {
			random_char = uppercase;
		} else if (i === 1) {
			random_char = lowercase;
		} else if (i === 2) {
			random_char = numbers;
		} else {
			random_char = symbols;
		}
		let index = Math.floor(Math.random() * 8);
		// if index is already used, then find another index
		while (used_indexes.includes(index)) {
			index = Math.floor(Math.random() * 8);
		}
		used_indexes.push(index);
		password =
			password.slice(0, index) +
			random_char[Math.floor(Math.random() * random_char.length)] +
			password.slice(index);
	}

	return password;
}

export default function UpdatePassword({
	user_id,
	children,
}: {
	user_id: string;
	children: React.ReactNode;
}) {
	const [password, setPassword] = useState(generatePassword());
	const [isToForce, setIsToForce] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const mutation = useMutation({
		mutationKey: ["reset_password" + user_id],
		mutationFn: () => resetUserPasswordAPI(user_id, password),
		onError: (error: AxiosTqError) => {
			const data = error.response?.data;
			// Based on how the API is designed, we can handle the error here
			if ("errors" in data && "code" in data.errors) {
				const code: string = data.errors.code;
				if (code === "PasswordInvalid") {
					setError(data.errors.detail?.non_field_errors[0]);
				} else {
					setError(
						data.errors.title +
							" (" +
							JSON.stringify(data.errors.detail) +
							")" +
							" [Code: " +
							code +
							"]"
					);
				}
			}
		},
	});

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Reset Password</DialogTitle>
				</DialogHeader>
				{mutation.isSuccess ? (
					<>
						<p className="p-3 text-[95%] leading-6 text-green-700 bg-green-100 rounded-md dark:text-green-500 dark:bg-transparent">
							Password has been reset successfully and copied to your clipboard.
							<br />
							<br />
							New Password: <b>{password}</b>
						</p>
					</>
				) : (
					<>
						{mutation.isError && (
							<div className="mt-2">
								<ErrorMessageAlert message={error || ""} title="Error" size="sm" />
							</div>
						)}
						<div className="mt-2 mb-4 space-y-5">
							<div className="space-y-1">
								<Label htmlFor="password" className="">
									New Password
								</Label>
								<div className="flex gap-2">
									<Input id="password" readOnly value={password} className="w-full" />
									<Button
										type="button"
										onClick={() => {
											const newPassword = generatePassword();
											setPassword(newPassword);
										}}
										variant={"secondary"}
									>
										<RefreshCcw className="w-4 h-4" />
									</Button>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Checkbox
									id="force_user_to_change_password"
									checked={isToForce}
									onCheckedChange={(checked) => {
										setIsToForce(checked.valueOf() as boolean);
									}}
								/>
								<Label htmlFor="force_user_to_change_password" className="font-normal">
									Force user to change password on next login
								</Label>
							</div>
						</div>
						<DialogFooter>
							<Button
								type="button"
								disabled={mutation.isPending}
								onClick={() => {
									// Copy to clipboard
									navigator.clipboard.writeText(password);
									mutation.mutate();
								}}
							>
								{mutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
								<span>Copy & Reset</span>
							</Button>
						</DialogFooter>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}

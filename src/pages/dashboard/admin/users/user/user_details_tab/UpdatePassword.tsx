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
import {Loader2} from "lucide-react";
import {Checkbox} from "@/components/ui/checkbox";

function generatePassword() {
	const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const lowercase = "abcdefghijklmnopqrstuvwxyz";
	const numbers = "0123456789";
	const symbols = "!@#$%^&*_+=";

	const all = uppercase + lowercase + numbers + symbols;

	let password = "";
	for (let i = 0; i < 8; i++) {
		password += all[Math.floor(Math.random() * all.length)];
	}

	// atleast one uppercase, lowercase, number and symbol inserted randomly
	for (let i = 0; i < 4; i++) {
		const index = Math.floor(Math.random() * 8);
		let random_char = "";
		if (index === 0) {
			random_char = uppercase;
		} else if (index === 1) {
			random_char = lowercase;
		} else if (index === 2) {
			random_char = numbers;
		} else {
			random_char = symbols;
		}
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
	const [password] = useState(generatePassword());
	const [isToForce, setIsToForce] = useState(true);

	const mutation = useMutation({
		mutationKey: ["reset_password" + user_id],
		mutationFn: () => resetUserPasswordAPI(user_id, password),
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
						<div className="mt-2 mb-4 space-y-5">
							<div className="space-y-1">
								<Label htmlFor="password" className="">
									New Password
								</Label>
								<Input id="password" readOnly defaultValue={password} className="w-full" />
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

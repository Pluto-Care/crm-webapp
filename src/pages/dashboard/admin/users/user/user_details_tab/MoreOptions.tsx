import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Ban, CircleUserRound, Info, Loader2, RectangleEllipsis} from "lucide-react";
import {ErrorMessageAlert} from "@/components/utils/ErrorMessageAlert";
import {AxiosTqError} from "@/lib/handleAxiosError";
import {disableUserMFAAPI} from "@/services/api/organization/admin/disable_user_mfa";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {MoreVertical} from "lucide-react";
import {disableUserAccountAPI} from "@/services/api/organization/admin/disable_user_account";
import {UserType} from "@/types/user";
import {enableUserAccountAPI} from "@/services/api/organization/admin/enable_user_account";

export default function UserDetailsMoreOptions({user}: {user: UserType}) {
	const [currentOption, setCurrentOption] = useState<string | null>(null);

	return (
		<Dialog>
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Button size="sm" variant="ghost" className="p-2">
						<MoreVertical className="w-5 h-5" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DialogTrigger
						onClick={() => {
							setCurrentOption("disable_mfa");
						}}
						asChild
					>
						<DropdownMenuItem>
							<RectangleEllipsis className="w-4 h-4 mr-2" />
							<span>Reset 2FA</span>
						</DropdownMenuItem>
					</DialogTrigger>
					{!user.is_active ? (
						<DialogTrigger
							onClick={() => {
								setCurrentOption("enable_acc");
							}}
							asChild
						>
							<DropdownMenuItem>
								<CircleUserRound className="w-4 h-4 mr-2" />
								<span>Enable Account</span>
							</DropdownMenuItem>
						</DialogTrigger>
					) : (
						<DialogTrigger
							onClick={() => {
								setCurrentOption("disable_acc");
							}}
							asChild
						>
							<DropdownMenuItem>
								<Ban className="w-4 h-4 mr-2" />
								<span>Disable Account</span>
							</DropdownMenuItem>
						</DialogTrigger>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
			{currentOption === "disable_mfa" ? (
				<DisableMFADialog user_id={user.id} />
			) : currentOption === "disable_acc" ? (
				<DisableAccountDialog user_id={user.id} />
			) : currentOption === "enable_acc" ? (
				<EnableAccountDialog user_id={user.id} />
			) : null}
		</Dialog>
	);
}

export function DisableMFADialog({user_id}: {user_id: string}) {
	const [error, setError] = useState<string | null>(null);

	const mutation = useMutation({
		mutationKey: ["disable_mfa" + user_id],
		mutationFn: () => disableUserMFAAPI(user_id),
		onError: (error: AxiosTqError) => {
			setError(JSON.stringify(error.response?.data.detail) || error.message);
		},
	});

	return (
		<DialogContent className="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle className="text-xl">Reset Multi-factor Authentication</DialogTitle>
			</DialogHeader>
			{mutation.isSuccess ? (
				<>
					<p className="p-3 text-[95%] leading-6 text-green-700 bg-green-100 rounded-md dark:text-green-500 dark:bg-transparent">
						Current multi-factor authentication has been disabled for this user.
						<br />
						User will be asked to setup new MFA on next login on a computer.
					</p>
				</>
			) : (
				<>
					{mutation.isError && (
						<div className="mt-2">
							<ErrorMessageAlert message={error || ""} title="Error" size="sm" />
						</div>
					)}
					<DialogDescription className="!mt-2 text-[95%] leading-6">
						Are you sure you want to reset multi-factor authentication?
					</DialogDescription>
					<DialogDescription className="!mt-1 text-[90%] leading-5 flex gap-2 text-muted-foreground">
						<Info className="size-6" />
						<span>User will be asked to setup new MFA on next login on a computer.</span>
					</DialogDescription>
					<DialogFooter className="mt-2">
						<Button
							type="button"
							disabled={mutation.isPending}
							onClick={() => {
								mutation.mutate();
							}}
						>
							{mutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
							<span>Reset</span>
						</Button>
					</DialogFooter>
				</>
			)}
		</DialogContent>
	);
}

export function DisableAccountDialog({user_id}: {user_id: string}) {
	const [error, setError] = useState<string | null>(null);
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationKey: ["disable_acc" + user_id],
		mutationFn: () => disableUserAccountAPI(user_id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["user_detail", user_id],
			});
		},
		onError: (error: AxiosTqError) => {
			setError(JSON.stringify(error.response?.data.detail) || error.message);
		},
	});

	return (
		<DialogContent className="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle className="text-2xl">Disable User Account</DialogTitle>
			</DialogHeader>
			{mutation.isSuccess ? (
				<>
					<p className="p-3 text-[95%] leading-6 text-green-700 bg-green-100 rounded-md dark:text-green-500 dark:bg-transparent">
						Account has been disabled for this user.
					</p>
				</>
			) : (
				<>
					{mutation.isError && (
						<div className="mt-2">
							<ErrorMessageAlert message={error || ""} title="Error" size="sm" />
						</div>
					)}
					<DialogDescription className="!mt-2 text-[90%] leading-6">
						Are you sure you want to disable this account?
					</DialogDescription>
					<DialogFooter className="mt-2">
						<Button
							type="button"
							variant={"destructive"}
							disabled={mutation.isPending}
							onClick={() => {
								mutation.mutate();
							}}
						>
							{mutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
							<span>Disable Account</span>
						</Button>
					</DialogFooter>
				</>
			)}
		</DialogContent>
	);
}

export function EnableAccountDialog({user_id}: {user_id: string}) {
	const [error, setError] = useState<string | null>(null);
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationKey: ["enable_acc" + user_id],
		mutationFn: () => enableUserAccountAPI(user_id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["user_detail", user_id],
			});
		},
		onError: (error: AxiosTqError) => {
			setError(JSON.stringify(error.response?.data.detail) || error.message);
		},
	});

	return (
		<DialogContent className="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle className="text-2xl">Enable User Account</DialogTitle>
			</DialogHeader>
			{mutation.isSuccess ? (
				<>
					<p className="p-3 text-[95%] leading-6 text-green-700 bg-green-100 rounded-md dark:text-green-500 dark:bg-transparent">
						Account has been enabled for this user.
					</p>
				</>
			) : (
				<>
					{mutation.isError && (
						<div className="mt-2">
							<ErrorMessageAlert message={error || ""} title="Error" size="sm" />
						</div>
					)}
					<DialogDescription className="!mt-2 text-[90%] leading-6">
						Once enabled, user will be able to login to the application.
					</DialogDescription>
					<DialogFooter className="mt-2">
						<Button
							type="button"
							disabled={mutation.isPending}
							onClick={() => {
								mutation.mutate();
							}}
						>
							{mutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
							<span>Enable Account</span>
						</Button>
					</DialogFooter>
				</>
			)}
		</DialogContent>
	);
}

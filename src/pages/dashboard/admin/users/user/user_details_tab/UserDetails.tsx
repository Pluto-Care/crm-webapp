import {UserPasswordChangeType, UserType} from "@/types/user";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {dateTimePretty, timediff} from "@/lib/dateTimeUtils";
import {Button} from "@/components/ui/button";
import UpdatePassword from "./UpdatePassword";
import UpdateProfile from "./UpdateProfile";
import {Badge} from "@/components/ui/badge";
import {HasPermission} from "@/contexts/auth";
import {UPDATE_USER_PASSWORD, UPDATE_USER_PROFILE} from "@/permissions/permissions";
import UserDetailsMoreOptions from "./MoreOptions";

export default function UserDetails({
	user,
	created_by,
	updated_by,
	password_change,
}: {
	user: UserType;
	created_by: UserType | null;
	updated_by: UserType | null;
	password_change: UserPasswordChangeType | null;
}) {
	const tzdiff = timediff(user.timezone);
	return (
		<>
			<div className="flex gap-12">
				<Avatar className="w-48 shadow-lg rounded-xl h-52">
					<AvatarFallback>{(user.first_name[0] || "") + (user.last_name[0] || "")}</AvatarFallback>
				</Avatar>
				<div className="w-full my-2">
					<div className="grid grid-cols-6 gap-1.5 text-[95%] max-w-sm">
						<div className="col-span-2 text-muted-foreground">Email:</div>
						<div className="col-span-4">
							<a href={`mailto:${user.email}`} className="underline">
								{user.email}
							</a>
						</div>
						<div className="col-span-2 text-muted-foreground">Active:</div>
						<div className="col-span-4">
							{user.is_active ? (
								<Badge variant={"outline"}>Yes</Badge>
							) : (
								<Badge variant={"destructive"}>No</Badge>
							)}
						</div>
						<div className="col-span-2 text-muted-foreground">Timezone:</div>
						<div className="col-span-4">
							{user.timezone} {tzdiff ? `${tzdiff}` : ""}
						</div>
						<div className="flex col-span-6 gap-3 mt-7">
							<HasPermission id={UPDATE_USER_PASSWORD} fallback={<></>}>
								<UpdatePassword user_id={user.id}>
									<Button variant={"outline"} size={"sm"}>
										Change Password
									</Button>
								</UpdatePassword>
							</HasPermission>
							<HasPermission id={UPDATE_USER_PROFILE} fallback={<></>}>
								<UpdateProfile user={user}>
									<Button variant={"outline"} size={"sm"}>
										Update Profile
									</Button>
								</UpdateProfile>
							</HasPermission>
							<UserDetailsMoreOptions user={user} />
						</div>
					</div>
				</div>
			</div>
			<div className="grid grid-cols-2 gap-8 px-3 py-4 pt-4 my-6 mt-10 bg-muted rounded-xl">
				<div className="col-span-2">
					<h5 className="px-2 mb-3">Password Changes</h5>
					<div className="p-4 space-y-1 text-[95%] bg-white dark:bg-zinc-950 shadow-sm rounded-lg">
						<table>
							<tr>
								<td className="pt-1 pr-10 text-muted-foreground min-w-16">Last Changed by User</td>
								<td className="text-[95%] pt-px">
									{password_change && password_change.date_last_changed_by_user
										? dateTimePretty(password_change.date_last_changed_by_user)
										: "Never"}{" "}
									{password_change?.last_pswd_change_method_by_user ? (
										<>({password_change?.last_pswd_change_method_by_user})</>
									) : (
										<></>
									)}
								</td>
							</tr>
							<tr>
								<td className="pt-1 pr-10 text-muted-foreground min-w-16">Last Changed by Admin</td>
								<td className="text-[95%] pt-px">
									{password_change && password_change.date_last_changed_by_admin
										? dateTimePretty(password_change.date_last_changed_by_admin)
										: "Never"}
								</td>
							</tr>

							<tr>
								<td className="pt-1 pr-10 text-muted-foreground min-w-16">Password Change Lock</td>
								<td className="text-[95%] pt-px">
									{password_change && password_change.pswd_change_lock_til ? (
										Date.now() - Date.parse(password_change.pswd_change_lock_til) < 0 ? (
											<>
												<Badge variant={"outline"}>Active</Badge> ends{" "}
												{dateTimePretty(password_change.pswd_change_lock_til)}
											</>
										) : (
											"None"
										)
									) : (
										"None"
									)}
								</td>
							</tr>
						</table>
					</div>
				</div>
				<div>
					<h5 className="px-2 mb-3">Added</h5>
					<div className="p-4 space-y-1 text-[95%] bg-white dark:bg-zinc-950 shadow-sm rounded-lg">
						<div className="flex">
							<div className="text-muted-foreground min-w-16">By</div>
							<div>
								<div>
									{created_by?.first_name} {created_by?.last_name}
								</div>
								<div className="mb-1.5 text-muted-foreground text-[95%]">{created_by?.email}</div>
							</div>
						</div>
						<div className="flex">
							<div className="text-muted-foreground min-w-16">On</div>
							<div className="text-[95%] pt-px">{dateTimePretty(user.created_at)}</div>
						</div>
					</div>
				</div>
				<div>
					<h5 className="px-2 mb-3">Last updated</h5>
					<div className="p-4 space-y-1 text-[95%] bg-white dark:bg-zinc-950 shadow-sm rounded-lg">
						{updated_by ? (
							<>
								<div className="flex">
									<div className="text-muted-foreground min-w-16">By</div>
									<div>
										<div>
											{updated_by.first_name} {updated_by.last_name}
										</div>
										<div className="mb-1.5 text-muted-foreground text-[95%]">
											{updated_by.email}
										</div>
									</div>
								</div>
								<div className="flex">
									<div className="text-muted-foreground min-w-16">On</div>
									<div className="text-[95%] pt-px">{dateTimePretty(user.updated_at)}</div>
								</div>
							</>
						) : (
							<div className="text-sm text-muted-foreground">Never updated</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}

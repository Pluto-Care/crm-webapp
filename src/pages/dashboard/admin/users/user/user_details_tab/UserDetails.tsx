import {UserType} from "@/types/user";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {dateTimePretty, timediff} from "@/lib/dateTimeUtils";
import {Button} from "@/components/ui/button";
import {MoreVertical} from "lucide-react";
import UpdatePassword from "./UpdatePassword";

export default function UserDetails({
	user,
	created_by,
	updated_by,
}: {
	user: UserType;
	created_by: UserType | null;
	updated_by: UserType | null;
}) {
	const tzdiff = timediff(user.timezone);
	return (
		<>
			<div className="flex gap-12">
				<Avatar className="w-48 shadow-lg rounded-xl h-52">
					<AvatarFallback>{(user.first_name[0] || "") + (user.last_name[0] || "")}</AvatarFallback>
				</Avatar>
				<div className="w-full my-2">
					<div className="grid grid-cols-6 gap-1.5 text-[95%]">
						<div className="col-span-1 text-muted-foreground">Email:</div>
						<div className="col-span-5">{user.email}</div>
						<div className="col-span-1 text-muted-foreground">Active:</div>
						<div className="col-span-5">{user.is_active ? "Yes" : "No"}</div>
						<div className="col-span-1 text-muted-foreground">Timezone:</div>
						<div className="col-span-5">
							{user.timezone} {tzdiff ? `(${tzdiff})` : ""}
						</div>
						<div className="flex col-span-6 gap-4 mt-7">
							<UpdatePassword user_id={user.id}>
								<Button variant={"outline"} size={"sm"}>
									Change Password
								</Button>
							</UpdatePassword>

							<Button variant={"secondary"} size={"sm"}>
								Update Profile
							</Button>
							<Button variant={"secondary"} className="p-0 aspect-square" size={"sm"}>
								<MoreVertical size={18} strokeWidth={2.75} />
							</Button>
						</div>
					</div>
				</div>
			</div>
			<div className="px-3 py-4 pt-4 my-6 mt-10 bg-muted rounded-xl">
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
						<div>{dateTimePretty(user.created_at)}</div>
					</div>
				</div>
				<h5 className="px-2 mt-6 mb-3">Last updated</h5>
				<div className="p-4 space-y-1 text-[95%] bg-white dark:bg-zinc-950 shadow-sm rounded-lg">
					{updated_by ? (
						<>
							<div className="flex">
								<div className="text-muted-foreground min-w-16">By</div>
								<div>
									<div>
										{updated_by.first_name} {updated_by.last_name}
									</div>
									<div className="mb-1.5 text-muted-foreground text-[95%]">{updated_by.email}</div>
								</div>
							</div>
							<div className="flex">
								<div className="text-muted-foreground min-w-16">On</div>
								<div>{dateTimePretty(user.updated_at)}</div>
							</div>
						</>
					) : (
						<div className="text-sm text-muted-foreground">Never updated</div>
					)}
				</div>
			</div>
		</>
	);
}

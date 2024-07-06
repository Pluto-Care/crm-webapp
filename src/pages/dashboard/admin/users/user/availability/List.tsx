import {useQuery} from "@tanstack/react-query";
import {getUserAvailabilityListAPI} from "@/services/api/availability/admin/list";
import spacetime from "spacetime";
import {dateTimePretty, formatPureDatePretty, weekDayFromPython} from "@/lib/dateTimeUtils";
import {Button} from "@/components/ui/button";
import {LoadingScreen} from "@/components/utils/LoadingScreen";

export default function UserAvailabilityList({
	user_id,
	timezone,
}: {
	user_id: string;
	timezone: string;
}) {
	const query = useQuery({
		queryKey: ["user_availability" + user_id],
		queryFn: () => getUserAvailabilityListAPI(user_id),
	});

	return (
		<div>
			{query.isFetching ? (
				<LoadingScreen />
			) : query.isSuccess ? (
				<>
					<div className="flex my-8 place-items-center">
						<h3 className="flex-1">Availabilities</h3>
						<Button
							variant={"outline"}
							size={"sm"}
							onClick={() => {
								query.refetch();
							}}
						>
							Refresh
						</Button>
					</div>
					<ul className="my-8 space-y-4">
						{query.data.length > 0 ? (
							query.data.map((availability) => (
								<li
									key={availability.id}
									className="grid grid-cols-2 p-4 bg-muted rounded-xl text-[90%]"
								>
									<div>Start date: {formatPureDatePretty(availability.start_date)}</div>
									<div>End date: {formatPureDatePretty(availability.end_date)}</div>
									<div>
										Start time:{" "}
										{spacetime(null, "UTC").time(availability.start_time).goto(timezone).time()}
									</div>
									<div>
										End time:{" "}
										{spacetime(null, "UTC").time(availability.end_time).goto(timezone).time()}
									</div>
									<div>
										Day: {availability.day ? weekDayFromPython(availability.day) : "Single"}
									</div>
									<div>Added on: {dateTimePretty(availability.created_at)}</div>
								</li>
							))
						) : (
							<div className="p-8 text-center rounded-lg bg-muted text-muted-foreground">
								No availabilities yet
							</div>
						)}
					</ul>
				</>
			) : (
				<></>
			)}
		</div>
	);
}

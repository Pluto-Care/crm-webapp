import {useQuery} from "@tanstack/react-query";
import {getUserAvailabilityListAPI} from "@/services/api/availability/admin/list";
import spacetime from "spacetime";
import {dateTimePretty, formatPureDatePretty, weekDayFromPython} from "@/lib/dateTimeUtils";

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
			{query.isLoading ? (
				<p>Loading...</p>
			) : query.isSuccess ? (
				<>
					<h3 className="my-8">Availabilities</h3>
					<ul className="my-8 space-y-4">
						{query.data.map((availability) => (
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
								<div>Day: {availability.day ? weekDayFromPython(availability.day) : "Single"}</div>
								<div>Added on: {dateTimePretty(availability.created_at)}</div>
							</li>
						))}
					</ul>
				</>
			) : (
				<></>
			)}
		</div>
	);
}

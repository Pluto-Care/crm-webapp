export function timeSince(timestamp: string) {
	const diff = Date.now() - Date.parse(timestamp);

	const seconds = diff / 1000;

	// let interval = seconds / 31536000;

	// if (interval > 1) {
	// 	return Math.floor(interval) + " year" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
	// }
	// interval = seconds / 2592000;
	// if (interval > 1) {
	// 	return Math.floor(interval) + " month" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
	// }
	let interval = seconds / 86400;
	if (interval > 1) {
		return (
			(Math.floor(interval) === 1 ? "a" : Math.floor(interval)) +
			" day" +
			(Math.floor(interval) > 1 ? "s" : "") +
			" ago"
		);
	}
	interval = seconds / 3600;
	if (interval > 1) {
		return (
			(Math.floor(interval) === 1 ? "an" : Math.floor(interval)) +
			" hour" +
			(Math.floor(interval) > 1 ? "s" : "") +
			" ago"
		);
	}
	interval = seconds / 60;
	if (seconds > 10) {
		return (
			(Math.floor(interval) === 1 ? "a" : Math.floor(interval)) +
			" min" +
			(Math.floor(interval) > 1 ? "s" : "") +
			" ago"
		);
	}
	if (Math.floor(seconds) <= 10) {
		return "just now";
	}
	return Math.floor(seconds) + " sec" + (Math.floor(seconds) > 1 ? "s" : "") + " ago";
}

export function dateTimePretty(dt: string) {
	const x = new Date(dt);
	const dd = x.getDate();
	const yy = x.getFullYear();
	return (
		yy +
		"/" +
		("0" + (x.getMonth() + 1)).slice(-2) +
		"/" +
		("0" + dd).slice(-2) +
		" at " +
		("0" + (x.getHours() > 12 ? x.getHours() - 12 : x.getHours())).slice(-2) +
		":" +
		("0" + x.getMinutes()).slice(-2) +
		" " +
		(x.getHours() > 12 ? "pm" : "am")
	);
}

export function datePretty(dt: string) {
	const x = new Date(dt);
	const dd = x.getDate();
	const yy = x.getFullYear();
	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	return monthNames[x.getMonth()] + " " + dd + ", " + yy;
}

export function timePretty(dt: string) {
	const x = new Date(dt);
	return (
		("0" + (x.getHours() > 12 ? x.getHours() - 12 : x.getHours())).slice(-2) +
		":" +
		("0" + x.getMinutes()).slice(-2) +
		" " +
		(x.getHours() > 12 ? "pm" : "am")
	);
}

/**
 *
 * @param dt - Date string `2022-11-02T23:15:14.327407Z`
 * @returns string - `November 2022`
 */
export function monthYear(dt: string) {
	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const x = new Date(dt);
	// let dd = x.getDate();
	const mm = monthNames[x.getMonth()];
	const yy = x.getFullYear();
	return mm + " " + yy;
}

/**
 * From date string
 * @param dt - Date string
 * @returns string
 */
export function weekDay(dt: string) {
	const x = new Date(dt);
	const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	return days[x.getDay()];
}

/**
 *
 * @param day - 0 to 6 (Monday to Sunday)
 * @returns string
 */
export function weekDayFromPython(day: number) {
	const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
	return days[day];
}

export function monthPretty(month: number) {
	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	return monthNames[month];
}

/**
 * Date format: YYYY-MM-DD
 */
export function formatPureDatePretty(date: string) {
	return (
		monthPretty(parseInt(date.split("-")[1])) +
		" " +
		parseInt(date.split("-")[2]) +
		", " +
		date.split("-")[0]
	);
}

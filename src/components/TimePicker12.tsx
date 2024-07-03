import * as React from "react";
import {TimePickerInput} from "@/components/ui/time-picker";
import {TimePeriodSelect} from "@/components/ui/time-period-select";
import {Period} from "@/components/ui/time-picker-utils";

interface TimePickerDemoProps {
	date: Date | undefined;
	setDate: (date: Date | undefined) => void;
}

export function TimePicker12Demo({date, setDate}: TimePickerDemoProps) {
	const [period, setPeriod] = React.useState<Period>("PM");

	const minuteRef = React.useRef<HTMLInputElement>(null);
	const hourRef = React.useRef<HTMLInputElement>(null);
	const periodRef = React.useRef<HTMLButtonElement>(null);

	return (
		<div className="flex items-end gap-2">
			<div className="grid gap-1">
				<TimePickerInput
					picker="12hours"
					period={period}
					date={date}
					setDate={setDate}
					ref={hourRef}
					onRightFocus={() => minuteRef.current?.focus()}
				/>
			</div>
			<div className="grid gap-1">
				<TimePickerInput
					picker="minutes"
					id="minutes12"
					date={date}
					setDate={setDate}
					ref={minuteRef}
					onLeftFocus={() => hourRef.current?.focus()}
					onRightFocus={() => periodRef.current?.focus()}
				/>
			</div>
			<div className="grid gap-1">
				<TimePeriodSelect
					period={period}
					setPeriod={setPeriod}
					date={date}
					setDate={setDate}
					ref={periodRef}
					onLeftFocus={() => minuteRef.current?.focus()}
				/>
			</div>
		</div>
	);
}

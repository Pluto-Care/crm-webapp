import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";

import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {toast} from "sonner";
import {useMutation, useQuery} from "@tanstack/react-query";
import {createPatientNoteAPI} from "@/services/api/patients/notes/create";
import {CheckCircle, Edit, Loader2, MoreVertical, Trash2} from "lucide-react";
import {getAllPatientNotesAPI} from "@/services/api/patients/notes/list";
import {datePretty, timePretty} from "@/lib/dateTimeUtils";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {useAuth, usePermission} from "@/contexts/auth";
import {FULL_ACCESS} from "@/permissions/permissions";

type Props = {
	patient_id: string;
};

export default function PatientNotes(props: Props) {
	const auth_context = useAuth();
	const is_full_access = usePermission(FULL_ACCESS);

	const notes_query = useQuery({
		queryKey: ["patient_notes", props.patient_id],
		queryFn: () => getAllPatientNotesAPI({patient_id: props.patient_id}),
	});

	const form = useForm({
		resolver: zodResolver(
			z.object({
				note: z.string(),
			})
		),
	});

	const onSubmit = form.handleSubmit((data) => {
		createNoteMutation.mutate({
			patient_id: props.patient_id,
			note_text: data.note,
		});
	});

	const createNoteMutation = useMutation({
		mutationKey: ["create_note"],
		mutationFn: (data: {patient_id: string; note_text: string}) => createPatientNoteAPI(data),
		onSuccess: () => {
			toast.success("Success", {
				icon: <CheckCircle className="size-4" />,
				description: "Note added successfully",
				position: "top-right",
			});
			form.reset({
				note: "",
			});
			createNoteMutation.reset();
			notes_query.refetch();
		},
	});

	return (
		<div className="px-4">
			<h2 className="mt-4 mb-4 text-xl">Notes</h2>
			<Form {...form}>
				<form onSubmit={onSubmit} className="space-y-4">
					<FormField
						control={form.control}
						name="note"
						render={({field}) => (
							<FormItem>
								<FormLabel>Create new note</FormLabel>
								<FormControl>
									<Textarea className="w-full" rows={5} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" className="w-full">
						Post
					</Button>
				</form>
			</Form>
			{notes_query.isLoading ? (
				<>
					<Loader2 className="size-4 animate-spin" />
				</>
			) : notes_query.isSuccess ? (
				<>
					<h4 className="mt-8 text-lg">Posted</h4>
					{notes_query.data.map((note) => (
						<div key={note.id} className="mt-6">
							<div className="flex gap-4">
								<Avatar>
									<AvatarFallback>CN</AvatarFallback>
								</Avatar>
								<div className="flex-1 pb-5 border-b border-muted">
									<div className="flex items-center">
										<div className="flex-1 text-sm">
											<div className="font-medium">
												{note.created_by.first_name} {note.created_by.last_name}
											</div>
											<div className="text-muted-foreground">{note.id}</div>
										</div>
										<div>
											{auth_context.user?.detail.id === note.created_by.id || is_full_access ? (
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" className="px-0 py-0 size-8">
															<MoreVertical className="size-5" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem
															className="flex items-center gap-2"
															onClick={() => {}}
														>
															<Edit className="size-4" />
															Edit
														</DropdownMenuItem>
														<DropdownMenuItem
															className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:!text-red-600 hover:dark:!text-red-400"
															onClick={() => {}}
														>
															<Trash2 className="size-4" />
															Delete
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											) : (
												<></>
											)}
										</div>
									</div>
									<p className="text-[95%] leading-6 !mt-4  whitespace-pre-line">{note.note}</p>
									<div className="mt-4 text-sm text-muted-foreground">
										{note.updated_at && (
											<>
												Last Updated: {datePretty(note.updated_at)} at {timePretty(note.updated_at)}
												,{" "}
											</>
										)}
										Created: {datePretty(note.created_at)} at {timePretty(note.created_at)}
									</div>
								</div>
							</div>
						</div>
					))}
				</>
			) : (
				<>
					<p>No notes found.</p>
				</>
			)}
		</div>
	);
}

"use client";

import * as z from "zod"
import axios from "axios";
import { Button } from "@/components/ui/button"
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation";
import { Course, Attachments } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";


interface AttachmentFormProps {
    initialData: Course & { attachments: Attachments[] };
    courseId: string;
};

const formSchema = z.object({
    url: z.string().min(1),
});

const AttachmentForm = ({
    initialData,
    courseId,
}: AttachmentFormProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const { toast } = useToast();

    const clickEdit = () => {
        setIsEditing(
            (current) => !current
        )
    }

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const course = await axios.post(`/api/courses/${courseId}/attachments`, values);
            toast({
                title: "Attachments Added Succesfully",
            })
            clickEdit();
            router.refresh();
        } catch {
            toast({
                title: "Something went wrong.",
                description: "Try again",
            })
        }
    };

    const onDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast({
                title: "Attachment Delete."
            })
            router.refresh();
        } catch (error) {
            toast({
                title: "Something went wrong.",
                description: "Try again",
            })
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-bold flex items-center justify-between">
                Course Attachments
                <Button onClick={clickEdit} variant="ghost" className="mt-3">
                    {(!isEditing) ? (
                        <>
                            {(initialData.attachments.length === 0) ? (
                                <>
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Add
                                </>
                            ) : (
                                <>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            Cancel
                        </>
                    )
                    }
                </Button>
            </div>
            <div className="font-medium flex items-center">
                {(!isEditing) ? (
                    <div>
                        <>
                            {(initialData.attachments.length === 0) ? (
                                <p className="text-sm-2 text-slate-500 italic">
                                    No Attachments yet
                                </p >
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        {initialData.attachments.map((attachment) => (
                                            <div
                                                key={attachment.id}
                                                className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                                            >
                                                <File className="h-4 w-4 mr02 flex-shrink-0" />
                                                <p>
                                                    {attachment.name}
                                                </p>
                                                {(deletingId === attachment.id) ? (
                                                    <div>
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="ml-auto hover:opacity-75 transition"
                                                        onClick={() => onDelete(attachment.id)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    </div>
                ) : (
                    <div>
                        <FileUpload
                            endPoint="courseAttachment"
                            onChange={(url) => {
                                if (url) {
                                    onSubmit({ url: url });
                                }
                            }}
                        />
                        <div className="text-xs text-muted-foreground mt-4">
                            Add Attachments for Course
                        </div>
                    </div>
                )}

            </div>
        </div >
    );
}

export default AttachmentForm;
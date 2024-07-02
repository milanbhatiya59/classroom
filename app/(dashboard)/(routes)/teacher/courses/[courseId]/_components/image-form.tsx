"use client";

import * as z from "zod"
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";


interface ImageFormProps {
    initialData: Course;
    courseId: string;
};

const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "Image is required",
    })
});

const ImageForm = ({
    initialData,
    courseId,
}: ImageFormProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const { toast } = useToast();

    const clickEdit = () => {
        setIsEditing(
            (current) => !current
        )
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            imageUrl: initialData?.description || "",
        }
    });

    const { isSubmitting, isValid } = form.formState;
    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const course = await axios.patch(`/api/courses/${courseId}`, values);
            toast({
                title: "Description Updated Succesfully",
            })
            clickEdit();
            router.refresh();
        } catch {
            toast({
                title: "Something went wrong.",
                description: "Try again",
            })
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-bold flex items-center justify-between">
                Course Thubnail Image
                <Button onClick={clickEdit} variant="ghost" className="mt-3">
                    {(!isEditing) ? (
                        <>
                            {(initialData.imageUrl) ? (
                                <>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit
                                </>
                            ) : (
                                <>
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Add
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
                        {(!initialData.imageUrl) ? (
                            <div className="flex items-center justify-center h-40 w-40 lg:h-60 lg:w-60 rounded-md bg-slate-200">
                                <ImageIcon className="h-10 w-10 text-slate-500" />
                            </div>
                        ) : (
                            <div className="relative aspect-video mt-2">
                                <Image
                                    alt="Upload"
                                    fill
                                    className="object-cover rounded-md"
                                    src={initialData.imageUrl}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <FileUpload
                            endPoint="courseImage"
                            onChange={(url) => {
                                if (url) {
                                    onSubmit({ imageUrl: url });
                                }
                            }}
                        />
                        <div className="text-xs text-muted-foreground mt-4">
                            16:9 aspect ratio recommended
                        </div>
                    </div>
                )}

            </div>
        </div >
    );
}

export default ImageForm;
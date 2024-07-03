"use client";

import * as z from "zod"
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Chapter, Course } from "@prisma/client";
import { Input } from "@/components/ui/input";


interface ChaptersFormProps {
    initialData: Course & { chapters: Chapter[] };
    courseId: string;
};

const formSchema = z.object({
    title: z.string().min(1),
});

const ChaptersForm = ({
    initialData,
    courseId,
}: ChaptersFormProps) => {

    const [isUpdating, setIsUpdating] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const { toast } = useToast();

    const clickCreating = () => {
        setIsCreating(
            (current) => !current
        )
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        }
    });

    const { isSubmitting, isValid } = form.formState;
    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const course = await axios.post(`/api/courses/${courseId}/chapters`, values);
            toast({
                title: "Chapter Created",
            })
            clickCreating();
            router.refresh();
        } catch {
            toast({
                title: "Something went wrong. On submit",
                description: "Try again",
            })
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-bold flex items-center justify-between">
                Course Chapters
            </div>
            <div className="font-medium flex justify-between">
                <div className="flex items-center">
                    {(isCreating) && (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-x-2 mt-4 flex">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    disabled={isSubmitting}
                                                    placeholder="Chapter Name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Descripition Should of 200 Characters or Less
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    disabled={!isValid || isSubmitting}
                                >
                                    Create
                                </Button>
                            </form>
                        </Form>
                    )}
                    {!isCreating && (
                        <div className={cn(
                            "text-sm mt-2",
                            !initialData.chapters.length && "text-slate-500 italic"
                        )}>
                            {!initialData.chapters.length && "No Chapters"}
                            {/* {List Of Chapters} */}
                            <p className="text-xs text-muted-foreground mt-4">
                                Drag and Drop to reorder the chapters
                            </p>
                        </div>
                    )}

                </div>
                <div>
                    <Button onClick={clickCreating} variant="ghost" className="mt-3">
                        {(isCreating) ? (
                            <>
                                Cancel
                            </>
                        ) : (
                            <>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add
                            </>
                        )
                        }
                    </Button>
                </div>
            </div>
        </div >
    );
}

export default ChaptersForm;
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
import { Input } from "@/components/ui/input"
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation";


interface TitleFormProps {
    initialData: {
        title: string;
    };
    courseId: string;
};

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Atleast 2 Characters",
    }).max(20, {
        message: "Atmax 20 Characters",
    })
});

const TitleForm = ({
    initialData,
    courseId,
}: TitleFormProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const { toast } = useToast();

    const clickEdit = () => {
        setIsEditing(
            (current) => !current
        )
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    const { isSubmitting, isValid } = form.formState;
    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const course = await axios.patch(`/api/courses/${courseId}`, values);
            toast({
                title: "Title Changed Succesfully",
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
                Course Title
            </div>
            <div className="font-medium flex justify-between">
                <div className="flex items-center">
                    {(!isEditing) ? (
                        <p className="text-sm mt-2">
                            {initialData.title}
                        </p>
                    ) : (
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
                                                    placeholder="Course title"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Title Should Atleast of 2 Characters
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    disabled={!isValid || isSubmitting}
                                >
                                    Submit
                                </Button>
                            </form>
                        </Form>
                    )}
                </div>
                <div>
                    <Button onClick={clickEdit} variant="ghost" className="mt-3">
                        {(isEditing) ? (
                            <>
                                Cancel
                            </>
                        ) : (
                            <>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                            </>
                        )
                        }
                    </Button>
                </div>
            </div>
        </div >
    );
}

export default TitleForm;
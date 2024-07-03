"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";
import { Combobox } from "@/components/ui/combobox";

interface CategoryFormProps {
    initialData: Course;
    courseId: string;
    options: { label: string; value: string }[];
}

const formSchema = z.object({
    categoryId: z.string().min(1, "Category is required"),
});

const CategoryForm = ({
    initialData,
    courseId,
    options
}: CategoryFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const clickEdit = () => {
        setIsEditing((current) => !current);
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId: initialData?.categoryId || ""
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast({
                title: "Category Updated Successfully",
            });
            clickEdit();
            router.refresh();
        } catch {
            toast({
                title: "Something went wrong.",
                description: "Try again",
            });
        }
    };

    const selectedOption = options.find((option) => option.value === initialData.categoryId);

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-bold flex items-center justify-between">Course Category</div>
            <div className="font-medium flex justify-between">
                <div className="flex items-center">
                    {!isEditing ? (
                        <p
                            className={cn(
                                "text-sm mt-2",
                                !initialData.categoryId && "text-slate-500 italic"
                            )}
                        >
                            {selectedOption?.label || "No Category"}
                        </p>
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-x-2 mt-4 flex">
                                <FormField
                                    control={form.control}
                                    name="categoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Combobox
                                                    options={options}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>Description should be 200 characters or less</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={!isValid || isSubmitting}>
                                    Save
                                </Button>
                            </form>
                        </Form>
                    )}
                </div>
                <div>
                    <Button onClick={clickEdit} variant="ghost" className="mt-3">
                        {isEditing ? ("Cancel") : <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                        </>
                        }
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CategoryForm;

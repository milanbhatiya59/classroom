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
import { Textarea } from "@/components/ui/textarea"
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";


interface PriceFormProps {
    initialData: Course;
    courseId: string;
};

const formSchema = z.object({
    price: z.coerce.number(),
});

const PriceForm = ({
    initialData,
    courseId,
}: PriceFormProps) => {

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
            price: initialData?.price || undefined,
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
                Course Price
            </div>
            <div className="font-medium flex justify-between">
                <div className="flex items-center">
                    {(!isEditing) ? (
                        <p className={cn(
                            "text-sm mt-2",
                            !initialData.price && "text-slate-500 italic"
                        )}
                        >
                            {(initialData.price) ? (
                                <>
                                    {formatPrice(initialData.price)}
                                </>
                            ) : (
                                <>
                                    No Price
                                </>
                            )}
                        </p>
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-x-2 mt-4 flex">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="1.0"
                                                    disabled={isSubmitting}
                                                    placeholder="Course Price"
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
                                    Save
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

export default PriceForm;
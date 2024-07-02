"use client";

import * as z from "zod";
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import {
    Form,
    FormControl,
    FormDescription,
    FormLabel,
    FormField,
    FormMessage,
    FormItem,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import Link from "next/link";


const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required",
    }),
});


const CreatePage = () => {

    const router = useRouter();
    const { toast } = useToast();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/courses", values);

            router.push(`/teacher/courses/${response.data.id}`)
            toast({
                title: "Course Created"
            })
        } catch {
            toast({
                title: "Something went wrong.",
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
        }
    };

    const { isSubmitting, isValid } = form.formState;

    return (
        <>
            <div className="max-w-5xl mx-auto p-6 h-screen">
                <div>
                    <h1 className="text-2xl">
                        Create Classroom
                    </h1>
                    <p className="text-sm text-slate-600">
                        What would you like you Name Your Classroom
                    </p>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8 mt-8"
                        >
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Classroom Title
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                placeholder="Subject"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            e.g.  'Class-11 Physics Class'
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div>
                                <Link href="/teacher/courses">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                    >
                                        Cancel
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={!isValid && isSubmitting}
                                >
                                    Continue
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div >
        </>
    );
}

export default CreatePage;
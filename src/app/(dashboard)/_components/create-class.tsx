"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { useLocalContext } from "./context";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
    DialogFooter,
} from "@/components/ui/dialog";
import { NextResponse } from "next/server"
import { toast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "next-auth/react";

const formSchema = z.object({
    subject: z.string().min(1, {
        message: "Classname is Required",
    }),
    description: z.string(),

})

const CreateClass = () => {

    const { createClassDialog, setCreateClassDialog } = useLocalContext();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            subject: "",
            description: "",
        },
    })

    const { data } = useSession();
    const userId = data?.user?.id;

    const createClass = async (values: { subject: string; description: string | null }) => {
        const subject = values.subject;
        const description = values.description;
        let data;
        try {
            data = await fetch("http://localhost:3000/api/classes", {
                method: "POST",
                body: JSON.stringify({ userId, subject, description }),
            })
        } catch (error) {
            data = { success: false };
        }

        console.log(data);
        if (data.status === 404) {
            toast({
                variant: "destructive",
                title: "Class cannot Created",
            })
        }
        else if (data.status === 201) {
            toast({
                title: "Class Created",
            })
        }
        return NextResponse.json({ result: data });
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        handleClose();
        createClass(values);
        console.log(values);

        form.reset();
    }

    const handleClose = () => setCreateClassDialog(false);

    return (
        <div>
            <Dialog
                open={createClassDialog}
                onOpenChange={setCreateClassDialog}
            >
                <DialogTrigger asChild>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]" aria-describedby="dialog-description">
                    <DialogHeader>
                        <DialogTitle>
                            Create or Join a Class
                        </DialogTitle>
                    </DialogHeader>
                    <div id="dialog-description" className="sr-only">
                        Fill out the form below to create or join a class.
                    </div>
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-4">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    <FormField
                                        control={form.control}
                                        name="subject"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Subject <p className="text-slate-500">(required)</p>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Type your message here." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <DialogFooter>
                                        <Button type="submit">
                                            Create
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </div>
                    </div>

                    {createClassDialog === false && (
                        <DialogClose asChild>
                            <div />
                        </DialogClose>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default CreateClass;

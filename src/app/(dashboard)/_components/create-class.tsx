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



const formSchema = z.object({
    classname: z.string().min(1, {
        message: "Classname is Required",
    }),
    subject: z.string().min(1, {
        message: "Subject is Required",
    }),
    section: z.string(),

})

const CreateClass = () => {

    const { createClassDialog, setCreateClassDialog } = useLocalContext();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            classname: "",
            subject: "",
            section: "",
        },
    })

    const createClass = async (values: { classname: string; subject: string; section: string | null }) => {
        const classname = values.classname;
        const subject = values.subject;
        const section = values.section;
        let data;
        try {
            data = await fetch("http://localhost:3000/api/create-classes", {
                method: "POST",
                body: JSON.stringify({ classname, subject, section }),
            })
        } catch (error) {
            data = { success: false };
        }
        if (data.status === 404) {
            toast({
                variant: "destructive",
                title: "Class cannot Created",
            })
        }
        else if (data.status === 200) {
            toast({
                title: "Class Created",
            })
        }
        return NextResponse.json({ result: data });
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        handleClose();
        // createClass(values);
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
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            Create or Join a Class
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-4">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    <FormField
                                        control={form.control}
                                        name="classname"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Class name <p className="text-slate-500">(required)</p>
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
                                        name="section"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Section</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
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
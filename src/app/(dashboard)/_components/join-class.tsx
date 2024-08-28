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
import { toast } from "@/components/ui/use-toast"
import { NextResponse } from "next/server"
import { useSession } from "next-auth/react";

const formSchema = z.object({
    classcode: z.string().min(1, {
        message: "ClassCode is Required",
    }),

})

const JoinClass = () => {

    const { joinClassDialog, setJoinClassDialog } = useLocalContext();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            classcode: "",
        },
    })


    const { data } = useSession();
    const userId = data?.user?.id;

    const joinClass = async (values: { classcode: string }) => {
        const classId = values.classcode;
        let data;
        try {
            data = await fetch(`http://localhost:3000/api/joinClassAsStudent`, {
                method: "POST",
                body: JSON.stringify({ userId, classId }),
            })
        } catch (error) {
            data = { success: false };
        }
        if (data.status === 404) {
            toast({
                variant: "destructive",
                title: "Class not Found",
            })
        }
        else if (data.status === 400) {
            toast({
                title: "Already Joined",
            })
        }
        else if (data.status === 200) {
            toast({
                title: "Class Joined",
            })
        }
        return NextResponse.json({ result: data });
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        handleClose();
        console.log(values.classcode);
        joinClass(values);
        form.reset();
    }

    const handleClose = () => setJoinClassDialog(false);

    return (
        <div>
            <Dialog
                open={joinClassDialog}
                onOpenChange={setJoinClassDialog}
            >
                <DialogTrigger asChild>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            Join Class
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-4">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    <FormField
                                        control={form.control}
                                        name="classcode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Class Code</FormLabel>
                                                <FormDescription>
                                                    Ask your teacher for the class code, then enter it here.
                                                </FormDescription>
                                                <FormControl>
                                                    <Input placeholder="#"{...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className='border-b shadow-sm' />
                                    <div>
                                        <h1>To sign in with a Class Code</h1>
                                        <div className="flex">
                                            <p className="text-black">•</p>
                                            <p className="text-slate-500 ml-2"> Use an authorised account</p >
                                        </div>
                                        <div className="flex">
                                            <p className="text-black">• </p>
                                            <p className="text-slate-500 ml-2">Use a class code with 5-7 letters or numbers, and no spaces or symbols</p >
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit">
                                            Join
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </div>
                    </div >
                    {joinClassDialog === false && (
                        <DialogClose asChild>
                            <div />
                        </DialogClose>
                    )}
                </DialogContent >
            </Dialog >
        </div >
    );
}

export default JoinClass;
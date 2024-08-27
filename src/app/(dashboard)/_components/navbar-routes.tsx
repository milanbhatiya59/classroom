"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useLocalContext } from "./context";
import CreateClass from "./create-class";
import JoinClass from "./join-class";
import Image from "next/image";
import { useSession } from "next-auth/react";

export const NavbarRoutes = () => {

    const { data: userdata } = useSession();
    const profileImage = userdata?.user?.image;
    const defaultAvatar = '/avatar.png';

    const userButtonAppearance = {
        elements: {
            userButtonAvatarBox: "w-9 h-9 m-auto",
        },
    };

    const [dialogOpen, setDialogOpen] = useState(false);

    const handleOpen = () => setDialogOpen(true);
    const handleClose = () => setDialogOpen(false);

    const { setCreateClassDialog, setJoinClassDialog } = useLocalContext();

    const handleCreate = () => {
        setCreateClassDialog(true);
        handleClose();
    };

    const handleJoin = () => {
        setJoinClassDialog(true);
        handleClose();
    };

    return (
        <>
            <div className="flex gap-x-2 ml-auto">
                <div className="w-11 h-11 rounded-full m-auto flex justify-center items-center hover:bg-slate-100">
                    <Dialog
                        open={dialogOpen}
                        onOpenChange={setDialogOpen}
                    >
                        <DialogTrigger asChild>
                            <Plus
                                className="text-lg text-black "
                                onClick={handleOpen}
                            />
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>
                                    Create or Join a Class
                                </DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4 ">
                                <div className="flex flex-col gap-4">
                                    <Button
                                        onClick={handleJoin}
                                    >
                                        Join Classroom
                                    </Button>
                                    <Button
                                        onClick={handleCreate}
                                    >
                                        Create Classroom
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="m-3">
                    <Image
                        className="h-8 w-8 rounded-full"
                        src={profileImage || defaultAvatar}
                        alt=""
                        width={50}
                        height={50}
                    />
                </div>
            </div >
            <CreateClass />
            <JoinClass />
        </>
    );
};

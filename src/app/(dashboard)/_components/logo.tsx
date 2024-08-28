"use client"

import Image from "next/image";
import { useSession } from "next-auth/react";

export const Logo = () => {

    const { data: userdata } = useSession();
    const profileImage = userdata?.user?.image

    return (
        <div className="flex">
            <div className="text-2xl mt-auto ml-1 text-slate-600">
                Classroom
            </div>
        </div >
    )
}
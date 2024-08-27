"use client"

import Image from "next/image";
import { useSession } from "next-auth/react";

export const Logo = () => {

    const { data: userdata } = useSession();
    const profileImage = userdata?.user?.image
    console.log(profileImage);


    return (
        <div className="flex">
            <Image
                height={50}
                width={50}
                alt="logo"
                src="/logo-iiita.svg"
            />
            <div className="text-2xl mt-auto ml-1 text-slate-600">
                Classroom
            </div>
        </div >
    )
}
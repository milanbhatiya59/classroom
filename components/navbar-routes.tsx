"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button';
import { LogOut } from "lucide-react";
import Link from "next/link";

export const NavbarRoutes = () => {
    const pathName = usePathname();
    const router = useRouter();

    const isTeacherPage = pathName?.includes('/teacher');
    const isPlayerPage = pathName?.includes('/chapter');



    return (
        <div className="flex gap-x-2 ml-auto">
            {isPlayerPage || isTeacherPage ? (
                <Link href="/">
                    <Button variant="secondary">
                        <LogOut className="h-4 w-4 mr-2" />
                        Exit
                    </Button>
                </Link>

            ) : (
                <Link href="/teacher/courses">
                    <Button className="sm" variant="secondary">
                        Teacher Mode
                    </Button>
                </Link>
            )}
            <UserButton afterSignOutUrl="/" />
        </div>
    );
}

"use client";


import { GraduationCap, Home, Settings, Users } from 'lucide-react'
import { SidebarItem } from './sidebar-item';

const HomeRoute = [
    {
        icon: Home,
        label: "Home",
        href: "/",
    },
];

const SettingRoute = [
    {
        icon: Settings,
        label: "Settings",
        href: "/setting",
    },
];

const TeachingRoute = [
    {
        icon: Users,
        label: "Teaching",
        href: "/teaching",
    },
];

const LearningRoute = [
    {
        icon: GraduationCap,
        label: "Learning",
        href: "/learning",
    },
];

export const SidebarRoutes = () => {

    return (
        <div className='flex flex-col w-full mt-2'>
            {HomeRoute.map((route) => (
                <SidebarItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />

            ))}
            <div className='border-b shadow-sm my-2' />
            {TeachingRoute.map((route) => (
                <SidebarItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />

            ))}
            <div className='border-b shadow-sm my-2' />
            {LearningRoute.map((route) => (
                <SidebarItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />

            ))}
            <div className='border-b shadow-sm my-2' />
            {SettingRoute.map((route) => (
                <SidebarItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />

            ))}
        </div >
    );
}
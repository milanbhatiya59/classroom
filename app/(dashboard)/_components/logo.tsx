import Image from "next/image";

export const Logo = () => {
    return (
        <div className="flex">
            <Image
                height={50}
                width={50}
                alt="logo"
                src="/logo.svg"
            />
            <div className="text-xl mt-[10px] ml-1 text-slate-600">
                Classroom
            </div>
        </div >
    )
}
"use client";

import { UploadDropzone } from "@/lib/uploadthing"
import { ourFileRouter } from "@/app/api/uploadthing/core"

import { useToast } from "@/components/ui/use-toast"

interface fileUploadProps {
    onChange: (url?: string) => void;
    endPoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({
    onChange,
    endPoint,
}: fileUploadProps) => {

    const { toast } = useToast();

    return (
        <UploadDropzone
            endpoint={endPoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].url);
            }}
            onUploadError={(error: Error) => {
                toast({
                    title: "Something Went Wrong !",
                    description: "Try Again"
                    // title: `${error.message}`
                })
            }}
        />
    );
}
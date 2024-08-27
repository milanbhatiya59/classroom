import { useSession } from "next-auth/react";
export { default } from "next-auth/middleware"

const { data: session } = useSession()

export const config = {
    matcher: ['/']
}
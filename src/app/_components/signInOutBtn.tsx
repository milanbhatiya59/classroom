"use client";

import { signIn, signOut, getProviders } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

function SignInOutBtn() {
    const [providers, setProviders] = useState<{ [key: string]: any } | null>(null);
    const { data: session } = useSession();

    useEffect(() => {
        const setAuthProvider = async () => {
            const res = await getProviders();
            setProviders(res);
        };
        setAuthProvider();
    }, []);

    console.log(session);


    return (
        <>
            {session && (
                session?.user?.id
            )}
            {!session && providers && (
                Object.values(providers).map((provider, index) => (
                    <button
                        onClick={() => signIn(provider.id)}
                        key={index}
                        className="text-white bg-slate-700 p-2 m-2 rounded"
                    >
                        Sign In with {provider.name}
                    </button>
                ))
            )}
            {session && (
                <button
                    onClick={() => signOut()}
                    className="text-white bg-slate-700 p-2 m-2 rounded"
                >
                    Sign Out
                </button>
            )}
        </>
    );
}

export default SignInOutBtn;

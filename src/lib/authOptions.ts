import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { NextAuthOptions } from "next-auth";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
    ],
    callbacks: {
        async signIn({ profile }) {
            if (!profile?.email) throw new Error("No Profile");

            await dbConnect();

            const email = profile.email;
            const username = profile.name || "";
            let user = await UserModel.findOne({ email });

            if (user) {
                user.username = username;
                await user.save();
            } else {
                user = new UserModel({
                    username,
                    email,
                    enrollments: []
                });
                await user.save();
            }

            return true;
        },
        async session({ session }) {
            const user = await UserModel.findOne({ email: session.user.email });
            session.user.id = user._id.toString();
            return session;
        }
    },
};

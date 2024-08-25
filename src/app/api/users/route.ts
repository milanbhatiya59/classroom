import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';


export async function POST(req: Request) {

    await dbConnect();

    try {
        const { username, email, enrollments } = await req.json();

        const newUser = new UserModel({
            username,
            email,
            enrollments,
        });

        await newUser.save();

        return Response.json(
            {
                success: true,
                message: 'User registered successfully.',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error registering user:', error);
        return Response.json(
            {
                success: false,
                message: 'Error registering user',
            },
            { status: 500 }
        );
    }
}

import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import ClassModel from '@/models/Class';

export async function GET(req: Request) {
    try {
        await dbConnect();

        // Extract the userId from the query parameters
        const url = new URL(req.url);
        const userId = url.searchParams.get('userId');

        if (!userId) {
            return new Response(
                JSON.stringify({ success: false, message: 'User ID is required' }),
                { status: 400 }
            );
        }

        // Find the user by ID
        const userData = await UserModel.findById(userId);
        if (!userData) {
            return new Response(
                JSON.stringify({ success: false, message: 'User not found' }),
                { status: 404 }
            );
        }

        // Fetch class data for each enrollment
        const classes = await Promise.all(
            userData.enrollments.map(async (enrollment) => {
                const classData = await ClassModel.findById(enrollment.classId);
                return {
                    id: classData?._id,
                    subject: classData?.subject,
                    description: classData?.description,
                };
            })
        );

        return new Response(
            JSON.stringify({ success: true, data: classes }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching user classes:', error);
        return new Response(
            JSON.stringify({ success: false, message: 'Error fetching user classes' }),
            { status: 500 }
        );
    }
}

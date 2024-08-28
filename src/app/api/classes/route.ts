import dbConnect from '@/lib/dbConnect';
import ClassModel from '@/models/Class';
import UserModel from '@/models/User';

export async function POST(req: Request) {
    try {
        await dbConnect();

        const { userId, subject, description, teachers = [], students = [], announcements = [] } = await req.json();

        teachers.push(userId);

        const newClass = new ClassModel({
            subject,
            description,
            teachers: teachers.map((teacher: string) => ({ userId: teacher })),
            students: students.map((student: string) => ({ userId: student })),
            announcements: announcements.map((announcement: string) => ({ announcementId: announcement })),
        });

        const data = await newClass.save();

        const classId = data._id;


        const userData = await UserModel.findById(userId);
        if (!userData) {
            return new Response(
                JSON.stringify({ success: false, message: 'User not found' }),
                { status: 404 }
            );
        }

        userData.enrollments.push({
            classId: classId.toString(),
            role: 'teacher',
            joinDate: new Date(),
        });
        await userData.save();


        return new Response(
            JSON.stringify({
                success: true,
                message: 'Class Created successfully'
            }),
            { status: 201 },
        );
    } catch (error) {
        console.error('Error creating Class:', error);
        return new Response(
            JSON.stringify({
                success: false,
                message: 'Error creating Class',
            }),
            { status: 500 }
        );
    }
}

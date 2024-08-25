import dbConnect from '@/lib/dbConnect';
import ClassModel from '@/models/Class';

export async function POST(req: Request) {
    try {
        await dbConnect();

        const { subject, description, teachers, students, announcements } = await req.json();

        const newClass = new ClassModel({
            subject,
            description,
            teachers: teachers.map((teacher: string) => ({ userId: teacher })),
            students: students.map((student: string) => ({ userId: student })),
            announcements: announcements.map((announcement: string) => ({ announcementId: announcement })),
        });

        await newClass.save();

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Class Created successfully',
            }),
            { status: 201 }
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

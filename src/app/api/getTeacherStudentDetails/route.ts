import dbConnect from '@/lib/dbConnect';
import ClassModel from '@/models/Class';
import UserModel from '@/models/User';

export async function GET(req: Request) {
    try {
        await dbConnect();

        // Extract the classId from the query parameters
        const url = new URL(req.url);
        const classId = url.searchParams.get('classId');

        if (!classId) {
            return new Response(
                JSON.stringify({ success: false, message: 'Class ID is required' }),
                { status: 400 }
            );
        }

        // Fetch the class data and populate the teacher and student IDs
        const classData = await ClassModel.findById(classId);
        if (!classData) {
            return new Response(
                JSON.stringify({ success: false, message: 'Class not found' }),
                { status: 404 }
            );
        }

        const teacherIds = classData.teachers;
        const teachers = await Promise.all(
            teacherIds.map(async (teacherId: any) => {
                const result = await UserModel.find(teacherId.userId);
                return {
                    'username': result[0].username,
                    'email': result[0].email
                };
            })
        );

        const studentIds = classData.students;
        const students = await Promise.all(
            studentIds.map(async (studentId: any) => {
                const result = await UserModel.findById(studentId.userId);
                return {
                    'username': result[0].username,
                    'email': result[0].email
                };
            })
        );


        return new Response(
            JSON.stringify({
                success: true,
                classData,
                teachers,  // Include teacher details
                students,  // Include student details
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching class data:', error);
        return new Response(
            JSON.stringify({ success: false, message: 'Error fetching class data' }),
            { status: 500 }
        );
    }
}

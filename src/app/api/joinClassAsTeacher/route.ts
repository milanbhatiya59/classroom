import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import ClassModel, { TeacherRef } from '@/models/Class';
import { Schema } from 'mongoose';

export async function POST(req: Request) {
    try {
        await dbConnect();

        const { userId, classId } = await req.json();

        const classData = await ClassModel.findById(classId);
        if (!classData) {
            return new Response(
                JSON.stringify({ success: false, message: 'Class not found' }),
                { status: 404 }
            );
        }

        const teacherRef: TeacherRef = { userId };
        classData.teachers.push(teacherRef);
        await classData.save();

        const userData = await UserModel.findById(userId);
        if (!userData) {
            return new Response(
                JSON.stringify({ success: false, message: 'User not found' }),
                { status: 404 }
            );
        }

        userData.enrollments.push({
            classId: classData._id.toString(),
            role: 'teacher',
            joinDate: new Date(),
        });
        await userData.save();

        return new Response(
            JSON.stringify({ success: true, message: 'Teacher joined the class successfully' }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error joining class as teacher:', error);
        return new Response(
            JSON.stringify({ success: false, message: 'Error joining class as teacher' }),
            { status: 500 }
        );
    }
}

import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import ClassModel, { StudentRef } from '@/models/Class';
import { Schema } from 'mongoose';

export async function POST(req: Request) {
    try {
        await dbConnect();

        const { userId, classId } = await req.json();

        // Find the class by ID
        const classData = await ClassModel.findById(classId);
        if (!classData) {
            return new Response(
                JSON.stringify({ success: false, message: 'Class not found' }),
                { status: 404 }
            );
        }

        // Create a new StudentRef object and add it to the class's students array
        const studentRef: StudentRef = { userId };
        classData.students.push(studentRef);
        await classData.save();

        // Update the user's enrollments with the new class as a student
        const userData = await UserModel.findById(userId);
        if (!userData) {
            return new Response(
                JSON.stringify({ success: false, message: 'User not found' }),
                { status: 404 }
            );
        }

        userData.enrollments.push({
            classId: classData._id.toString(),
            role: 'student',
            joinDate: new Date(),
        });
        await userData.save();

        return new Response(
            JSON.stringify({ success: true, message: 'Student joined the class successfully' }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error joining class as student:', error);
        return new Response(
            JSON.stringify({ success: false, message: 'Error joining class as student' }),
            { status: 500 }
        );
    }
}

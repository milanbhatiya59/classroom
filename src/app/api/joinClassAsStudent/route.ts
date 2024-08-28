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

        // Find the user by ID
        const userData = await UserModel.findById(userId);
        if (!userData) {
            return new Response(
                JSON.stringify({ success: false, message: 'User not found' }),
                { status: 404 }
            );
        }

        // Check if the user is already enrolled in the class
        const isEnrolled = userData.enrollments.some(enrollment =>
            enrollment.classId.toString() === classId
        );
        if (isEnrolled) {
            return new Response(
                JSON.stringify({ success: false, message: 'User is already enrolled in this class' }),
                { status: 400 }
            );
        }

        // Create a new StudentRef object and add it to the class's students array
        const studentRef: StudentRef = { userId };
        classData.students.push(studentRef);
        await classData.save();

        // Update the user's enrollments with the new class as a student
        userData.enrollments.push({
            classId: classId.toString(),
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

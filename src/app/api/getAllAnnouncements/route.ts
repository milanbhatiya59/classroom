import dbConnect from '@/lib/dbConnect';
import ClassModel from '@/models/Class';

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

        // Find the class by ID and populate the announcements
        const classData = await ClassModel.findById(classId).populate('announcements.announcementId');
        if (!classData) {
            return new Response(
                JSON.stringify({ success: false, message: 'Class not found' }),
                { status: 404 }
            );
        }

        // Extract the announcements from the populated class
        const announcements = classData.announcements.map(ann => ann.announcementId);

        return new Response(
            JSON.stringify({ success: true, announcements }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching class announcements:', error);
        return new Response(
            JSON.stringify({ success: false, message: 'Error fetching class announcements' }),
            { status: 500 }
        );
    }
}

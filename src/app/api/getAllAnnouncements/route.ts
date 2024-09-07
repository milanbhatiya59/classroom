import dbConnect from '@/lib/dbConnect';
import AnnouncementModel from '@/models/Announcement';

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

        // Find all announcements for the given class ID
        const announcements = await AnnouncementModel.find({ classId });

        return new Response(
            JSON.stringify({ success: true, announcements }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching announcements:', error);
        return new Response(
            JSON.stringify({ success: false, message: 'Error fetching announcements' }),
            { status: 500 }
        );
    }
}

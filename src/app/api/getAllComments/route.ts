import dbConnect from '@/lib/dbConnect';
import CommentModel from '@/models/Comment';

export async function GET(req: Request) {
    try {
        await dbConnect();

        // Extract the announcementId from the query parameters
        const url = new URL(req.url);
        const announcementId = url.searchParams.get('announcementId');

        if (!announcementId) {
            return new Response(
                JSON.stringify({ success: false, message: 'Announcement ID is required' }),
                { status: 400 }
            );
        }

        // Find all comments for the given announcement ID
        const comments = await CommentModel.find({ announcementId });

        return new Response(
            JSON.stringify({ success: true, comments }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching announcement comments:', error);
        return new Response(
            JSON.stringify({ success: false, message: 'Error fetching announcement comments' }),
            { status: 500 }
        );
    }
}

import dbConnect from '@/lib/dbConnect';
import AnnouncementModel from '@/models/Announcement';

export async function POST(req: Request) {
    try {
        await dbConnect();

        const { classId, title, description, comments } = await req.json();

        const newAnnouncement = new AnnouncementModel({
            classId,
            title,
            description,
            comments,
        });

        await newAnnouncement.save();

        return Response.json(
            {
                success: true,
                message: 'Announcement created successfully',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating announcement:', error);
        return Response.json(
            {
                success: false,
                message: 'Error creating announcement',
            },
            { status: 500 }
        );
    }
}

import dbConnect from '@/lib/dbConnect';
import AnnouncementModel from '@/models/Announcement';
import ClassModel from '@/models/Class';

export async function POST(req: Request) {
    try {
        await dbConnect();

        // Parse the incoming request data
        const { classId, title, description, comments } = await req.json();

        // Create a new announcement
        const newAnnouncement = new AnnouncementModel({
            classId,
            title,
            description,
            comments: comments || [],
        });

        // Save the announcement to the database
        const savedAnnouncement = await newAnnouncement.save();

        // Update the class by pushing the new announcement's ID to the announcements array
        await ClassModel.findByIdAndUpdate(
            classId,
            { $push: { announcements: { announcementId: savedAnnouncement._id } } },
            { new: true }
        );

        // Send success response
        return Response.json(
            {
                success: true,
                message: 'Announcement created and added to class successfully',
                announcementId: savedAnnouncement._id,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating announcement:', error);

        // Send error response
        return Response.json(
            {
                success: false,
                message: 'Error creating announcement',
            },
            { status: 500 }
        );
    }
}

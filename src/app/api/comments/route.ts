import dbConnect from '@/lib/dbConnect';
import CommentModel from '@/models/Comment';

export async function POST(req: Request) {
    try {
        await dbConnect();

        const { userId, text } = await req.json();

        const newComment = new CommentModel({
            userId,
            text,
        });

        await newComment.save();

        return Response.json(
            {
                success: true,
                message: 'Comment created successfully',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating comment:', error);
        return Response.json(
            {
                success: false,
                message: 'Error creating comment',
            },
            { status: 500 }
        );
    }
}







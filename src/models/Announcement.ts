import mongoose, { Schema, Document } from 'mongoose';

interface CommentRef extends Document {
    commentId: Schema.Types.ObjectId;
}

const CommentRefSchema: Schema<CommentRef> = new mongoose.Schema({
    commentId: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        required: true,
    }
});

interface Announcement extends Document {
    classId: Schema.Types.ObjectId;
    title: string;
    description: string;
    comments: CommentRef[];
} 

const AnnouncementSchema: Schema<Announcement> = new mongoose.Schema({
    classId: {
        type: Schema.Types.ObjectId,
        ref: "Class",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    comments: [CommentRefSchema]
});

const AnnouncementModel = (mongoose.models.Announcement as mongoose.Model<Announcement>) || mongoose.model<Announcement>('Announcement', AnnouncementSchema);

export default AnnouncementModel;

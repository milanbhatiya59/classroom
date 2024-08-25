import mongoose, { Schema, Document } from 'mongoose';

interface Comment extends Document {
    userId: Schema.Types.ObjectId;
    text: string;
}

const CommentSchema: Schema<Comment> = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        required: true,
    }
});

const CommentModel = (mongoose.models.Comment as mongoose.Model<Comment>) || mongoose.model<Comment>('Comment', CommentSchema);

export default CommentModel;

import mongoose, { Schema, Document } from 'mongoose';

interface Enrols extends Document {
    classId: string;
    role: string;
    joinDate: Date;
}

const EnrolsSchema: Schema<Enrols> = new mongoose.Schema({
    classId: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    joinDate: {
        type: Date,
        required: true,
        default: Date.now,
    }
});

interface User extends Document {
    username: string;
    email: string;
    enrollments: Enrols[];
}

const UserSchema: Schema<User> = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    enrollments: [EnrolsSchema]
});

const UserModel = mongoose.models.User || mongoose.model<User>('User', UserSchema);

export default UserModel;

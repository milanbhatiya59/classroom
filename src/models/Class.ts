import mongoose, { Schema, Document } from 'mongoose';

export interface StudentRef extends Document {
    userId: Schema.Types.ObjectId;
}

const StudentRefSchema: Schema<StudentRef> = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
});

export interface TeacherRef extends Document {
    userId: Schema.Types.ObjectId;
}

const TeacherRefSchema: Schema<TeacherRef> = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
});

interface AnnouncementRef extends Document {
    announcementId: Schema.Types.ObjectId;
}

const AnnouncementRefSchema: Schema<AnnouncementRef> = new mongoose.Schema({
    announcementId: {
        type: Schema.Types.ObjectId,
        ref: "Announcement",
        required: true,
    }
});

interface Class extends Document {
    subject: string;
    description: string;
    teachers: TeacherRef[];
    students: StudentRef[];
    announcements: AnnouncementRef[];
}

const ClassSchema: Schema<Class> = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    teachers: [TeacherRefSchema],
    students: [StudentRefSchema],
    announcements: [AnnouncementRefSchema],
});

const ClassModel = (mongoose.models.Class as mongoose.Model<Class>) || mongoose.model<Class>('Class', ClassSchema);

export default ClassModel;

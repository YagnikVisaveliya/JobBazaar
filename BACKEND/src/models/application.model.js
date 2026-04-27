import mongoose, { Schema } from "mongoose";

const applicationSchema = new Schema(
    {
        job: {
            type: Schema.Types.ObjectId,
            ref: 'Job', 
            required: true
        },
        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User ',  // no trailing spaces here
            required: true,
        },
        resume: {
            type: String
        },
        status: {
            type: String,
            enum: ['Pending','Reviewed','Rejected','Accepted'], 
            default: 'Pending' 
        },
        appliedAt: {
            type: Date, 
        },
        interview: {
            status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'] },
            mode: { type: String, enum: ['On-site', 'Online'] },
            date: { type: Date },
            time: { type: String },
            address: { type: String },
            link: { type: String },
            proctoringWarnings: { type: Number, default: 0 }
        }
    },
    {
        timestamps: true
    }
)

export const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);
// export const Application = mongoose.model("application",applicationSchema);
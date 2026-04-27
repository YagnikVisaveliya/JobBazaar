import mongoose ,{Schema} from "mongoose";
import jwt from "jsonwebtoken" // used to not readable word for user
import bcrypt from "bcrypt" //used in password incrypt and decrypt

const userSchema = new Schema(
    {
        fullname:{
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true,
        },
        phoneNumber:{
            type: Number,
            required: true,
        },
        password: {
            type: String,
            required: [true,'password is required'],
        },
        role: {
            type: String,
            required: true,
            enum: ['jobseeker', 'recruiter']
        },
        profile: {
            bio:{type: String},
            skills:[{type: String}],
            resume:{type: String}, // URL or file path to the resume
            resumeOriginalName: {type: String},
            company:{type:mongoose.Schema.Types.ObjectId, ref:'Company'},
            profilePhoto:{
                type:String,
                default:"",
                
            },
            savedJobs: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Job'
                }
            ]
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true 
    }
)

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next()
});
// Method to compare password for authentication
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            role: this.role

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model('User ', userSchema);
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import jwt from "jsonwebtoken";
import dataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken() // generateAccessToken is method
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "something went wrong while generating refresh and access token")
    }
}

const register = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists - e.g., by email, username, etc.

    const { fullname, email, phoneNumber, password, role } = req.body;
    console.log(fullname, email, phoneNumber, password, role);


    if ([fullname, email, phoneNumber, password, role].some((fields) => !String(fields ?? "").trim())) {
        throw new ApiError(400, "All fields are required");
    }
    const file = req.file;
    let profilePhoto = "";

    if (file) {
        try {
            const fileUri = dataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            profilePhoto = cloudResponse?.secure_url || "";
        } catch (error) {
            // Do not fail registration when avatar upload fails in local/dev.
            console.error("Profile photo upload failed:", error?.message || error);
        }
    }

    // Here you would typically check if the user already exists in your database
    const existedUser = await User.findOne({
        $or: [{ email }, { fullname }]
    })
    if (existedUser) {
        throw new ApiError(409, "User already exists with this email or fullname");
    }

    const user = await User.create({
        fullname,
        email,
        phoneNumber,
        password,
        role,
        profile: {
            profilePhoto,
        }
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong, user not created");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );
})

const login = asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;
    // console.log(email,password,role);


    if ([email, password, role].some((fields) => fields?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(404, "User does not exits")
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    if (role !== user.role) {
        throw new ApiError(403, `You are not a ${role}, please login with a ${user.role} account`)
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = { // cookie not modify in frontend olny modified in beckend side
        httpOnly: true,
        secure: true,
        sameSite: "None"
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged In Successfully"));

})

const logout = asyncHandler(async (req, res) => {
    try {
        
        let userId = req.user?._id;

        const incomingRefreshToken = req.cookies?.refreshToken;
        if (!userId && incomingRefreshToken) {
            try {
                const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
                userId = decoded?._id;
            } catch (error) {
                console.log(error)
            }
        }

        if (userId) {
            await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } }, { new: true });
        }

        const clearOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/"
        };

        res.clearCookie("accessToken", clearOptions);
        res.clearCookie("refreshToken", clearOptions);

        return res.status(200).json(new ApiResponse(200, {}, "User LogOut Successfully"));
    } catch (error) {
        // Ensure cookies are cleared even on error
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.status(200).json(new ApiResponse(200, {}, "User LogOut Successfully"));
    }
});


const updateProfile = asyncHandler(async (req, res) => {
    try {
        const { fullname, phoneNumber, email, bio, skills } = req.body;
        // console.log(fullname, phoneNumber, email, bio, skills);

        let cloudResponse;
        const file = req.file;
        if (file) {
        const fileUri = dataUri(file);

        cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        type: "upload",        
        access_mode: "public"
      });      
    }



        const userId = req.user?._id || req.user?.id;
        // console.log("User  ID from request:", userId);
        if (!userId) {
            throw new ApiError(401, "Unauthorized: User ID missing");
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User  not found");
        }

        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;

        if (skills) {
            const skillsArray = skills.split(',').map(skill => skill.trim());
            if (skillsArray.length > 0) {
                user.profile.skills = skillsArray;
            }
        }

        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url;
            user.profile.resumeOriginalName = file.originalname;
        }

        await user.save();

        const responseUser = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        };

        return res.status(200).json({
            status: 200,
            message: "Profile updated successfully",
            data: responseUser,
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        // You can pass the original error message or a generic one
        throw new ApiError(500, error.message || "Something went wrong while updating profile");
    }
});


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new (401, "Invalid refresh Token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh Token Is Expire or used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(
                200,
                {
                    accessToken,
                    refreshToken: newRefreshToken
                },
                "Access token refresh "
            ))
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.comparePassword(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "password change successfully"))
});

export const toggleSaveJob = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { jobId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isSaved = user.profile.savedJobs.includes(jobId);

    if (isSaved) {
        // Remove from saved jobs
        user.profile.savedJobs = user.profile.savedJobs.filter(id => id.toString() !== jobId);
    } else {
        // Add to saved jobs
        user.profile.savedJobs.push(jobId);
    }

    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, { isSaved: !isSaved }, isSaved ? "Job removed from saved list" : "Job saved successfully")
    );
});

export const getSaveJobs = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const user = await User.findById(userId).populate({
        path: 'profile.savedJobs',
        populate: {
            path: 'company'
        }
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, user.profile.savedJobs, "Saved jobs fetched successfully")
    );
});

export {
    register,
    login,
    logout,
    refreshAccessToken,
    changeCurrentPassword,
    updateProfile,
}




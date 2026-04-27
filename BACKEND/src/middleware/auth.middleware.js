import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // debug - inspect what the server receives
        // console.log("AUTH middleware - cookies:", req.cookies);
        // console.log("AUTH middleware - authorization header:", req.headers.authorization);

        const tokenFromCookie = req.cookies?.accessToken;
        const authHeader = req.headers.authorization || req.header("Authorization");
        const tokenFromHeader = authHeader
            ? authHeader.toLowerCase().startsWith("bearer ")
                ? authHeader.slice(7).trim()
                : authHeader.trim()
            : undefined;
        const tokenFromBody = req.body?.accessToken;

        const token = tokenFromCookie || tokenFromHeader || tokenFromBody;

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (error) {
        // preserve explicit auth errors for easier debugging
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});
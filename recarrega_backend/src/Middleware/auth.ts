import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import logger from "../Utils/logger.js"
import dotenv from "dotenv";
dotenv.config();

function auth(req: Request, res: Response, next: NextFunction): Response | undefined {
    try {
        logger.info("Authentication middleware invoked")

        // Check if JWT_SECRET has been set in .env
        const jwt_secret = process.env.JWT_SECRET;
        if (!jwt_secret) {
            logger.error("JWT_SECRET environment variable is missing or invalid")
            return res.status(500).json({ message: "Internal server error" })
        }

        // Check if token is present in Authorization header
        const token = req.header("Authorization")?.replace("Bearer", "");
        if (!token) {
            // If token is missing, return a 401 status code - Unauthorized
            logger.error("Authentication token is missing or invalid");
            return res.status(401).json({ message: "No token provided" });
        }
        logger.debug("Retrieved token successfully")

        // Check if token is valid
        const decodedUser = jwt.verify(token, jwt_secret);

        // Add decoded user to req.user
        req.user = decodedUser;

        // Call next function
        next();
    } catch (error) {
        // Check if error is an instance of Error
        const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred";

        logger.error(`Authentication error: ${errorMessage}`);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

export default auth;
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import logger from "../Utils/logger";
import type { JwtPayload } from "jsonwebtoken";
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
        const token = req.header("Authorization")?.replace("Bearer ", "");
        logger.debug(`Token: ${token}`);
        if (!token) {
            // If token is missing, return a 401 status code - Unauthorized
            logger.error("Authentication token is missing or invalid");
            return res.status(401).json({ message: "No token provided" });
        }
        logger.debug("Retrieved token successfully")

        // Check if token is valid
        const decodedUser = jwt.verify(token, jwt_secret);
        logger.debug(`Decoded user: ${JSON.stringify(decodedUser)}`);

        // Add decoded user to req.user
        // This is a workaround for error TS2339
        // https://stackoverflow.com/questions/38324949/error-ts2339-property-x-does-not-exist-on-type-y
        const newReq: any = req; 
        newReq.user = decodedUser as JwtPayload;

        // Call next function
        next();
    } catch (error) {
        // Check if error is an instance of Error
        if (error instanceof JsonWebTokenError) {
            logger.error(`Authentication error: ${error.message}`);
            return res.status(401).json({ message: "Invalid or expired token" });
        } else if (error instanceof Error) {
            logger.error(`Error: ${error.message}`);
            return res.status(500).json({ error: "Internal server error" });
        }


        
    }
}

export default auth;
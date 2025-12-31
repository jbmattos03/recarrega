import UserService from "../Services/userService";
import { Request, Response } from "express";
import logger from "../Utils/logger";
import type { JwtPayload } from "jsonwebtoken";

class UserController {
    static async createUser(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;
            logger.info(`Creating user with email ${email}`);

            logger.debug(`Calling UserService with name ${name} and email ${email}`);
            const user = await UserService.createUser(name, email, password);
            logger.info("User created successfully")

            // Transform user to json and remove password
            const userObj = user.toJSON();
            logger.debug(`User: ${JSON.stringify(userObj)}`);
            delete userObj.password;

            return res.status(201).json({
                message: "User created successfully",
                user: userObj,
            });
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message);

                // Picking the right status code
                // Refer to error_messages.md to know more
                switch (error.name) {
                    case "UserExistsError":
                        return res.status(404).json({ error: error.name });
                    case "UserNotFoundError":
                        return res.status(404).json({ error: error.name });
                    case "MissingAttributesError":
                        return res.status(400).json({ error: error.name});
                    default:
                        return res.status(500).json({ error: "Internal server error" });
                }
            } else {
                logger.error("Something went fantastically wrong. Good luck");
                return res.status(500).json({ error: "Internal server error" });
            }
        }
    }

    static async updateUser(req: Request, res: Response) {
        try {
            // Getting name and email from request body
            const { name, email } = req.body;

            // Getting user from JWT token
            // This is a workaround for error TS2339
            // https://stackoverflow.com/questions/38324949/error-ts2339-property-x-does-not-exist-on-type-y
            const newReq: any = req;
            const user = newReq.user as JwtPayload;

            // Getting TS id from jwt token
            const idParam = user.id;
            if (!user.id) {
                logger.error("User id is missing from jwt token");
                res.status(400).json({ error: "JWT token missing or malformed" });
            }

            const id = Number(idParam);
            if (isNaN(id)) {
                logger.error("TS id is not a valid number");
                return res.status(400).json({ error: "TS id must be a number" });
            }
            logger.info(`Updating user with id ${id}`);

            logger.debug(`Calling UserService with name ${name} and email ${email}`);
            const updatedUser = await UserService.updateUser(id, name, email);
            logger.info("User updated successfully");

            // Transformar user to json and remove password
            const userObj = updatedUser?.toJSON();
            logger.debug(`Updated user: ${JSON.stringify(userObj)}`);
            delete userObj.password;

            return res.status(200).json({
                message: "User updated successfully",
                user: userObj,
            });
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message);

                // Picking the right status code
                // Refer to error_messages.md to know more
                switch (error.name) {
                    case "UserExistsError":
                        return res.status(404).json({ error: error.name });
                    case "UserNotFoundError":
                        return res.status(404).json({ error: error.name });
                    case "MissingAttributesError":
                        return res.status(400).json({ error: error.name});
                    default:
                        return res.status(500).json({ error: "Internal server error" });
                }
            } else {
                logger.error("Something went fantastically wrong. Good luck");
                return res.status(500).json({ error: "Internal server error" });
            }
        }
    }

    static async deleteUser(req: Request, res: Response) {
        try {
            // Getting user from JWT token
            // This is a workaround for error TS2339
            // https://stackoverflow.com/questions/38324949/error-ts2339-property-x-does-not-exist-on-type-y
            const newReq: any = req;
            const user = newReq.user as JwtPayload;

            // Getting user id from jwt token
            const idParam = user.id;
            if (!user.id) {
                logger.error("User id is missing from jwt token");
                return res.status(400).json({ error: "JWT token missing or malformed" });
            }

            const id = Number(idParam);
            if (isNaN(id)) {
                logger.error("User id is not a valid number");
                return res.status(400).json({ error: "User id must be a number" });
            }
            logger.info(`Deleting user with id ${id}`);

            // Deleting user
            logger.debug(`Calling UserService with id ${id}`);
            await UserService.deleteUser(id);
            logger.info("User deleted successfully");

            return res.status(204).json({ message: "User deleted successfully" });
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message);

                // Picking the right status code
                // Refer to error_messages.md to know more
                switch (error.name) {
                    case "UserExistsError":
                        return res.status(404).json({ error: error.name });
                    case "UserNotFoundError":
                        return res.status(404).json({ error: error.name });
                    case "MissingAttributesError":
                        return res.status(400).json({ error: error.name});
                    default:
                        return res.status(500).json({ error: "Internal server error" });
                }
            } else {
                logger.error("Something went fantastically wrong. Good luck");
                return res.status(500).json({ error: "Internal server error" });
            }
        }
    }

    static async loginUser(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            logger.info(`Logging user with email ${email} in`);

            logger.debug(`Calling UserService with ${email} and ${password}`);
            const token = await UserService.loginUser(email, password);
            logger.info("User logged in successfully");

            return res.status(200).json({
                message: "User logged in successfully",
                token: token,
            });
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message);

                // Picking the right status code
                // Refer to error_messages.md to know more
                switch (error.name) {
                    case "UserExistsError":
                        return res.status(404).json({ error: error.name });
                    case "UserNotFoundError":
                        return res.status(404).json({ error: error.name });
                    case "MissingAttributesError":
                        return res.status(400).json({ error: error.name});
                    case "InvalidCredentialsError":
                        return res.status(401).json({ error: error.name });
                    default:
                        return res.status(500).json({ error: "Internal server error" });
                }
            } else {
                logger.error("Something went fantastically wrong. Good luck");
                return res.status(500).json({ error: "Internal server error" });
            }
        }
    }

    static async getUserById(req: Request, res: Response) {
        try {
            // Getting user from JWT token
            // This is a workaround for error TS2339
            // https://stackoverflow.com/questions/38324949/error-ts2339-property-x-does-not-exist-on-type-y
            const newReq: any = req;
            const user = newReq.user as JwtPayload;

            // Getting user id from jwt token
            const idParam = user.id;
            if (!user.id) {
                logger.error("User id is missing from jwt token");
                return res.status(400).json({ error: "JWT token missing or malformed" });
            }

            const id = Number(idParam);
            if (isNaN(id)) {
                logger.error("User id is not a valid number");
                return res.status(400).json({ error: "User id must be a number" });
            }
            logger.info(`Fetching user with id ${id}`);

            // Fetching user
            logger.debug(`Calling UserService with ${id}`);
            const fetchedUser = await UserService.findUserByPk(id);
            logger.info("User fetched successfully");

            const fetchedUserObj = fetchedUser.toJSON();
            logger.debug(`User: ${JSON.stringify(fetchedUserObj)}`);

            return res.status(200).json({
                message: "User fetched successfully",
                userObj: fetchedUserObj,
            });
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message);

                // Picking the right status code
                // Refer to error_messages.md to know more
                switch (error.name) {
                    case "UserExistsError":
                        return res.status(404).json({ error: error.name });
                    case "UserNotFoundError":
                        return res.status(404).json({ error: error.name });
                    case "MissingAttributesError":
                        return res.status(400).json({ error: error.name});
                    case "InvalidCredentialsError":
                        return res.status(401).json({ error: error.name });
                    default:
                        return res.status(500).json({ error: "Internal server error" });
                }
            } else {
                logger.error("Something went fantastically wrong. Good luck");
                res.status(500).json({ error: "Internal server error" });
            }
        }
    }
}

export default UserController;
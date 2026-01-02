import UserService from "../Services/userService";
import { Request, Response } from "express";
import logger from "../Utils/logger";
import type { JwtPayload } from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config()

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

    static async requestPasswordReset(req: Request, res: Response) {
        try {
            // Getting email from request body
            const { email } = req.body;
            logger.info(`Requesting password reset for user with email ${email}`);

            // Getting user
            const user = await UserService.findUserByEmail(email);

            // Generate reset token
            const updatedUser = await UserService.setPasswordResetToken(user.id);
            logger.debug(`Token: ${updatedUser?.resetToken}`);
            logger.debug(`Token expiry: ${updatedUser?.resetTokenExpiration}`);

            // Creating test account
            const testAccount = await nodemailer.createTestAccount();
            
            // Creating transport
            const transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });

            // Creating email
            const mailOptions = {
                from: '"Test Sender" <test@sender.com>',
                to: `${email}`,
                subject: "Password reset",
                text: `You are receiving this because you (or someone else) have requested the reset of the password for your recarrega account.\n\n
                Please click on the following link, or paste this into your browser to complete the process:\n\n
                http://localhost:${process.env.PORT}/reset-password/${encodeURIComponent(updatedUser?.resetToken ?? '')}\n\n
                If you did not request this, please ignore this email and your password will remain unchanged.\n`,
            }
            logger.info(`Sending password reset email to: ${user.email}`);

            // Sending email
            const info = await transporter.sendMail(mailOptions);
            logger.info("Password reset email sent successfully.");
            logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);

            return res.status(200).json({ message: "Password reset email sent successfully" });
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
                    case "InvalidPasswordError":
                        return res.status(400).json({ error: error.name });
                    case "ResetTokenInvalidError":
                        return res.status(400).json({ error: error.name });
                    default:
                        return res.status(500).json({ error: "Internal server error" });
                }
            } else {
                logger.error("Something went fantastically wrong. Good luck");
                return res.status(500).json({ error: "Internal server error" });
            }
        }
    }

    static async updatePassword(req: Request, res: Response){
        try {
            // Getting resetToken from request params
            const { resetToken } = req.params;
            if (!resetToken) {
                logger.error("Reset token missing from request params");
                return res.status(400).json({ error: "Reset token missing or not found" });
            }
            const { password } = req.body;
            if (!resetToken) {
                logger.error("Password missing from request body");
                return res.status(401).json({ error: "New password must not be blank" });
            }

            // Updating password
            logger.debug(`Calling UserService with reset token ${resetToken}`);
            await UserService.resetPassword(resetToken, password);
            logger.info("Password updated successfully");
            
            return res.status(204).json({ message: "Password updated successfully" });
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
                    case "InvalidPasswordError":
                        return res.status(400).json({ error: error.name });
                    case "ResetTokenInvalidError":
                        return res.status(400).json({ error: error.name });
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
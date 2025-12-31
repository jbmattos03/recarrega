import TSToUserService from "../Services/TSToUserService";
import TSService from "../Services/TSService";
import logger from "../Utils/logger";
import { Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";

class TSToUserController {
    // TSToUser functions
    // These will be managed by the user in the frontend
    static async createTSToUser(req: Request, res: Response) {
        try {
            // Getting TS name and usage from the request body
            const { name, city, fare, timesUsedADay, daysUsedAMonth } = req.body;
            logger.debug(`Creating TSU with name ${name}, city ${city}, fare ${fare}, timesUsedADay ${timesUsedADay}, daysUsedAMonth ${daysUsedAMonth}`);

            // Getting user from JWT token
            // This is a workaround for error TS2339
            // https://stackoverflow.com/questions/38324949/error-ts2339-property-x-does-not-exist-on-type-y
            const newReq: any = req;
            const user = newReq.user as JwtPayload;

            // Getting user id
            const userId = user.id;

            // Checking if a TS with that name, city and fare exists
            const TS = await TSService.findTSByNameCityAndFare(name, city, fare);
            logger.debug(`TS: ${JSON.stringify(TS)}`);
            if (TS) {
                logger.info(`TS already exists`);

                logger.debug(`Calling TSToUserService with TS id ${TS.id}, user id ${userId}, TUAD ${timesUsedADay} and DUAM ${daysUsedAMonth}`);
                const TSU = await TSToUserService.createTSToUser(
                    TS.id,
                    userId,
                    timesUsedADay,
                    daysUsedAMonth
                );

                const TSUObj = TSU.toJSON();
                logger.info("TSU created successfully");
                logger.debug(`TSU: ${JSON.stringify(TSUObj)}`);
                
                return res.status(201).json({
                    message: "Transportation service added successfully",
                    TSU: TSUObj,
                })
            } else {
                logger.info("TS not found. Creating one");

                // Create a new transportation service
                logger.debug(`Calling TSService with name ${name}, city ${city} and fare ${fare}`);
                const newTS = await TSService.createTS(name, city, fare);
                logger.info("TS created successfully");

                logger.debug(`Calling TSToUserService with TS id ${newTS.id}, user id ${userId}, TUAD ${timesUsedADay} and DUAM ${daysUsedAMonth}`);
                const TSU = await TSToUserService.createTSToUser(
                    newTS.id,
                    userId,
                    timesUsedADay,
                    daysUsedAMonth
                );
                logger.info("TSU created successfully");

                const TSUObj = TSU.toJSON();
                logger.debug(`TSU: ${JSON.stringify(TSUObj)}`);
                
                return res.status(201).json({
                    message: "Transportation service created successfully",
                    TSU: TSUObj
                });
            }
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message);

                // Picking the right status code
                // Refer to error_messages.md to know more
                switch (error.name) {
                    case "TSUExistsError":
                        return res.status(404).json({ error: error.name });
                    case "TSUNotFoundError":
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

    static async updateTSToUser(req: Request, res: Response) {
        try {
            // Getting attributes from request body
            const { timesUsedADay, daysUsedAMonth } = req.body;
            
            // Getting user from JWT token
            // This is a workaround for error TS2339
            // https://stackoverflow.com/questions/38324949/error-ts2339-property-x-does-not-exist-on-type-y
            const newReq: any = req;
            const user = newReq.user as JwtPayload;

            // Getting user id
            const userId = user.id;

            // Getting TS id from request params
            const TSIdParam = req.params.TSId;
            if (!TSIdParam) {
                logger.error("TS id not found in req.params");
                return res.status(400).json({ error: "TS id missing or not found" });
            }

            // Checking TS id are numbers
            const TSId = Number(TSIdParam);
            if (isNaN(TSId)) {
                logger.error("TS id is not a valid number");
                return res.status(400).json({ error: "TS id must be a number" });
            }
            logger.info(`Updating transportation service ${TSId} for user ${userId}`);

            // Update TSU
            logger.debug(`Calling TSToUserService with TS id ${TSId}, user id ${userId}, TUAD ${timesUsedADay} and DUAM ${daysUsedAMonth}`);
            const updatedTSU = await TSToUserService.updateTSToUser(TSId, userId, timesUsedADay, daysUsedAMonth);
            logger.info("TSU updated successfully");

            // Getting json object
            const TSUObj = updatedTSU?.toJSON();
            logger.debug(`TSU: ${JSON.stringify(TSUObj)}`);

            return res.status(200).json({
                message: "Transportation service updated successfully",
                TSU: TSUObj
            })

        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message);

                // Picking the right status code
                // Refer to error_messages.md to know more
                switch (error.name) {
                    case "TSUExistsError":
                        return res.status(404).json({ error: error.name });
                    case "TSUNotFoundError":
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

    static async deleteTSToUser(req: Request, res: Response) {
        try {
            // Getting user from JWT token
            // This is a workaround for error TS2339
            // https://stackoverflow.com/questions/38324949/error-ts2339-property-x-does-not-exist-on-type-y
            const newReq: any = req;
            const user = newReq.user as JwtPayload;

            // Getting user id
            const userId = user.id;

            // Getting TS id from request params
            const TSIdParam = req.params.TSId;
            if (!TSIdParam) {
                logger.error("TS id not found in req.params");
                return res.status(400).json({ error: "TS id missing or not found" });
            }
            
            const TSId = Number(TSIdParam);
            if (isNaN(TSId)) {
                logger.error("TS id is not a valid number");
                return res.status(400).json({ error: "TS id must be a number" });
            }
            logger.info(`Deleting transportation service ${TSId} for user ${userId}`);

            logger.debug(`Calling TSToUserService with TS id ${TSId} and user id ${userId}`);
            await TSToUserService.deleteTSToUser(TSId, userId);
            logger.info("TSU deleted successfully");

            return res.status(204).json({ message: "Transportation service deleted sucessfully" });
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message);

                // Picking the right status code
                // Refer to error_messages.md to know more
                switch (error.name) {
                    case "TSUExistsError":
                        return res.status(404).json({ error: error.name });
                    case "TSUNotFoundError":
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

    static async getAllTSByUser(req: Request, res: Response) {
        try {
            // Getting user from JWT token
            // This is a workaround for error TS2339
            // https://stackoverflow.com/questions/38324949/error-ts2339-property-x-does-not-exist-on-type-y
            const newReq: any = req;
            const user = newReq.user as JwtPayload;

            // Getting user id
            const userId = user.id;

            // Getting TS list
            logger.debug(`Calling TSToUserService with user id ${userId}`);
            const TSList = await TSToUserService.findAllTSUByUser(userId);
            logger.info(`Successfully fetched TS list for user ${userId}`);
            logger.debug(`TSU: ${JSON.stringify(TSList)}`);

            return res.status(200).json({
                message: "Transportation Service list fetched successfully",
                TSList: TSList,
            });
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message);

                // Picking the right status code
                // Refer to error_messages.md to know more
                switch (error.name) {
                    case "TSUExistsError":
                        return res.status(404).json({ error: error.name });
                    case "TSUNotFoundError":
                        return res.status(404).json({ error: error.name });
                    case "MissingAttributesError":
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

    static async getTSUByUserIdAndTSId(req: Request, res: Response) {
        try {
            // Getting user from JWT token
            // This is a workaround for error TS2339
            // https://stackoverflow.com/questions/38324949/error-ts2339-property-x-does-not-exist-on-type-y
            const newReq: any = req;
            const user = newReq.user as JwtPayload;

            // Getting user id
            const userId = user.id;

            // Getting TS id from request params
            const TSIdParam = req.params.TSId;
            if (!TSIdParam) {
                logger.error("TS id not found in req.params");
                return res.status(400).json({ error: "TS id missing or not found" });
            }
            
            const TSId = Number(TSIdParam);
            if (isNaN(TSId)) {
                logger.error("TS id is not a valid number");
                return res.status(400).json({ error: "TS id must be a number" });
            }

            // Getting TSU
            logger.debug(`Calling TSToUserService with user id ${userId} and TS id ${TSId}`);
            const TSU = await TSToUserService.findTSToUserByTSIdAndUserId(TSId, userId);
            logger.info("TSU fetched successfully");

            // Getting TSU object
            const TSUObj = TSU.toJSON();
            logger.debug(`TSU: ${JSON.stringify(TSUObj)}`);

            return res.status(200).json({
                message: "Transportation Service fetched successfully",
                TSList: TSUObj,
            });
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message);

                // Picking the right status code
                // Refer to error_messages.md to know more
                switch (error.name) {
                    case "TSUExistsError":
                        return res.status(404).json({ error: error.name });
                    case "TSUNotFoundError":
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
}

export default TSToUserController;
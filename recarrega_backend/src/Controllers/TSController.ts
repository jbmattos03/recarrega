import TSService from "../Services/TSService";
import { Request, Response } from "express";
import logger from "../Utils/logger";
import type { JwtPayload } from "jsonwebtoken";

class TSController {
    static async createTS(req: Request, res: Response) {
        try {
            // Getting name and fare from request body
            const { name, city, fare } = req.body;
            logger.info(`Creating TS with name ${name}, city ${city} and fare ${fare}`);
            
            // Calling TSService
            logger.debug(`Calling TSService with name ${name}, city ${city} and fare ${fare}`);
            const TS = await TSService.createTS(name, city, fare);
            logger.info("TS created successfully")

            // Getting TS service
            const TSObj = TS.toJSON()
            logger.debug(`TS: ${JSON.stringify(TSObj)}`);

            return res.status(201).json({
                message: "Transportation service created successfully",
                TS: TSObj,
            });
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message);

                // Picking the right status code
                // Refer to error_messages.md to know more
                switch (error.name) {
                    case "TSExistsError":
                        res.status(404).json({ error: error.name });
                    case "TSNotFoundError":
                        res.status(404).json({ error: error.name });
                    case "MissingAttributesError":
                        res.status(400).json({ error: error.name});
                    default:
                        res.status(500).json({ error: "Internal server error" });
                }
            } else {
                logger.error("Something went fantastically wrong. Good luck");
                res.status(500).json({ error: "Internal server error" });
            }
        }
    }

    static async updateTS(req: Request, res: Response) {
        try {
            // Getting name and fare from request body
            const { name, city, fare } = req.body;

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
            logger.info(`Updating TS with id ${TSId}`);

            // Calling TSService
            logger.debug(`Calling TSService with name ${name} and fare ${fare}`)
            const updatedTS = await TSService.updateTS(TSId, name, city, fare);
            logger.info("Transportation service updated successfully");

            const updatedTSObj = updatedTS?.toJSON();
            logger.debug(`TS: ${JSON.stringify(updatedTSObj)}`);

            return res.status(200).json({
                message: "Transportation service updated successfully",
                TS: updatedTSObj,
            });
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message);

                // Picking the right status code
                // Refer to error_messages.md to know more
                switch (error.name) {
                    case "TSExistsError":
                        return res.status(404).json({ error: error.name });
                    case "TSNotFoundError":
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

    static async deleteTS(req: Request, res: Response) {
        try {
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
            logger.info(`Deleting TS with id ${TSId}`);

            // Calling TSService
            logger.debug(`Calling TSService with TSId ${TSId}`);
            await TSService.deleteTS(TSId);
            logger.info("Transportation service deleted successfully");

            return res.status(204).json({ message: "Transportation service deleted successfully" });
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message);

                // Picking the right status code
                // Refer to error_messages.md to know more
                switch (error.name) {
                    case "TSExistsError":
                        return res.status(404).json({ error: error.name });
                    case "TSNotFoundError":
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

    static async getTSByNameCityAndFare(req: Request, res: Response) {
        try {
            const { name, city, fare } = req.body;
            
            // Getting TS
            logger.debug(`Calling TSService with name ${name}, city ${city} and ${fare}`);
            const TS = await TSService.findTSByNameCityAndFare(name, city, fare);
            logger.info("TS fetched successfully");

            // Getting TSObj
            const TSObj = TS?.toJSON();
            logger.debug(`TS: ${JSON.stringify(TS)}`);

            res.status(200).json({
                message: "Transportation service fetched successfully",
                TSObj: TSObj,
            });
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message);

                // Picking the right status code
                // Refer to error_messages.md to know more
                switch (error.name) {
                    case "TSExistsError":
                        return res.status(404).json({ error: error.name });
                    case "TSNotFoundError":
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

    static async getAllTS(req: Request, res: Response) {
        try {
            // Getting TS
            logger.debug(`Calling TSService`);
            const TSList = await TSService.findAllTS();
            logger.info("TS list fetched successfully");
            logger.debug(`TS list: ${JSON.stringify(TSList)}`);

            res.status(200).json({
                message: "Transportation service list fetched successfully",
                TSlist: TSList,
            });
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message);

                // Picking the right status code
                // Refer to error_messages.md to know more
                switch (error.name) {
                    case "TSExistsError":
                        return res.status(404).json({ error: error.name });
                    case "TSNotFoundError":
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

export default TSController;
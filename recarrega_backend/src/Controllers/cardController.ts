import CardService from "../Services/cardService";
import { Request, Response } from "express";
import logger from "../Utils/logger";
import type { JwtPayload } from "jsonwebtoken";

class CardController {
    static async createCard(req: Request, res: Response) {
        try {
            // Getting name and balance from request body
            const { name, balance } = req.body;

            // Getting user from JWT token
            // This is a workaround for error TS2339
            // https://stackoverflow.com/questions/38324949/error-ts2339-property-x-does-not-exist-on-type-y
            const newReq: any = req;
            const user = newReq.user as JwtPayload;

            // Getting user id from user
            const userId = user.id;

            // Getting TS id from request params
            const TSIdParam = req.params.TSId;
            if (!TSIdParam) {
                logger.error("TS id not found in req.params");
                return res.status(400).json({ error: "TS id missing or not found" });
            }

            // Checking if TS id is a number
            const TSId = Number(TSIdParam);
            if (isNaN(TSId)) {
                logger.error("TS id is not a valid number");
                return res.status(400).json({ error: "TS id must be a number" });
            }

            logger.debug(`Calling CardService with name ${name}, balance ${balance}, TS id ${TSId} and user id ${userId}`);
            const card = await CardService.createCard(name, balance, TSId, userId);
            logger.info("Card created successfully");

            const cardObj = card.toJSON();
            logger.debug(`Card: ${JSON.stringify(cardObj)}`);

            res.status(201).json({
                message: "Card created successfully",
                cardObj: cardObj,
            });
        } catch (error) {
            if (error instanceof Error) {
                switch (error.name) {
                    case "CardExistsError":
                        logger.error(error.message);
                        return res.status(404).json({ error: error.name });
                    case "CardNotFoundError":
                        logger.error(error.message);
                        return res.status(404).json({ error: error.name });
                    case "MissingAttributesError":
                        logger.error(error.message);
                        return res.status(400).json({ error: error.name });
                    default:
                        logger.error(error.message);
                        return res.status(500).json({ error: "Internal server error" });
                }
            } else {
                logger.error("Something went fantastically wrong. Good luck");
                res.status(500).json({ error: "Internal server error" });
            }
        }
    }

    static async updateCard(req: Request, res: Response) {
        try {
            // Getting name and balance from request body
            const { name, balance } = req.body;

            // Getting card id from request params
            const cardIdParam = req.params.cardId;
            if (!cardIdParam) {
                logger.error("Card id not found in req.params");
                return res.status(400).json({ error: "Card id missing or not found" });
            }

            // Checking if TS id is a number
            const cardId = Number(cardIdParam);
            if (isNaN(cardId)) {
                logger.error("Card id is not a valid number");
                res.status(400).json({ error: "Card id must be a number" });
            }

            logger.debug(`Calling CardService with card id ${cardId}, name ${name} and balance ${balance}`);
            const card = await CardService.updateCard(cardId, name, balance);
            logger.info("Card created successfully");

            const cardObj = card?.toJSON();
            logger.debug(`Card: ${JSON.stringify(cardObj)}`);

            res.status(200).json({
                message: "Card created successfully",
                cardObj: cardObj,
            });
        } catch (error) {
            if (error instanceof Error) {
                switch (error.name) {
                    case "CardExistsError":
                        logger.error(error.message);
                        return res.status(404).json({ error: error.name });
                    case "CardNotFoundError":
                        logger.error(error.message);
                        return res.status(404).json({ error: error.name });
                    case "MissingAttributesError":
                        logger.error(error.message);
                        return res.status(400).json({ error: error.name });
                    default:
                        logger.error(error.message);
                        return res.status(500).json({ error: "Internal server error" });
                }
            } else {
                logger.error("Something went fantastically wrong. Good luck");
                res.status(500).json({ error: "Internal server error" });
            }
        }
    }

    static async deleteCard(req: Request, res: Response) {
        try {
            // Get card id from req params
            const cardIdParam = req.params.cardId;
            if(!cardIdParam) {
                logger.error("Card id not found in req params");
                return res.status(400).json({ error: "Card id missing or not found" });
            }

            const cardId = Number(cardIdParam);
            if (isNaN(cardId)) {
                logger.error("Card id is not a valid number");
                return res.status(400).json({ error: "Card id must be a valid number" });
            }

            logger.debug(`Calling CardService with card id ${cardId}`);
            await CardService.deleteCard(cardId);
            logger.info("Card deleted successfully");

            return res.status(204).json({ message: "Card deleted successfully" });
        } catch (error) {
            if (error instanceof Error) {
                switch (error.name) {
                    case "CardExistsError":
                        logger.error(error.message);
                        return res.status(404).json({ error: error.name });
                    case "CardNotFoundError":
                        logger.error(error.message);
                        return res.status(404).json({ error: error.name });
                    case "MissingAttributesError":
                        logger.error(error.message);
                        return res.status(400).json({ error: error.name });
                    default:
                        logger.error(error.message);
                        return res.status(500).json({ error: "Internal server error" });
                }
            } else {
                logger.error("Something went fantastically wrong. Good luck");
                res.status(500).json({ error: "Internal server error" });
            }
        }
    }

    static async calculateBalance(req: Request, res: Response) {
        try {
             // Get card id from req params
            const cardIdParam = req.params.cardId;
            if(!cardIdParam) {
                logger.error("Card id not found in req params");
                return res.status(400).json({ error: "Card id missing or not found" });
            }

            const cardId = Number(cardIdParam);
            if (isNaN(cardId)) {
                logger.error("Card id is not a valid number");
                return res.status(400).json({ error: "Card id must be a valid number" });
            }

            logger.debug(`Calling CardService with card id ${cardId}`);
            const newBalance = await CardService.calculateBalance(cardId);
            logger.info("New balance calculated successfully");

            return res.status(200).json({
                message: "New balance calculated successfully",
                newBalance: newBalance,
            });
        } catch (error) {
            if (error instanceof Error) {
                switch (error.name) {
                    case "CardExistsError":
                        logger.error(error.message);
                        return res.status(404).json({ error: error.name });
                    case "CardNotFoundError":
                        logger.error(error.message);
                        return res.status(404).json({ error: error.name });
                    case "MissingAttributesError":
                        logger.error(error.message);
                        return res.status(400).json({ error: error.name });
                    default:
                        logger.error(error.message);
                        return res.status(500).json({ error: "Internal server error" });
                }
            } else {
                logger.error("Something went fantastically wrong. Good luck");
                res.status(500).json({ error: "Internal server error" });
            }
        }
    }

    static async getCardById(req: Request, res: Response) {
        try {
            // Getting card id from req params
            const cardIdParam = req.params.cardId;
            if (!cardIdParam) {
                logger.error("Card id missing from request params");
                return res.status(400).json({ error: "Card id missing or not found" });
            }

            const cardId = Number(cardIdParam);
            if (isNaN(cardId)) {
                logger.error("Card id is not a valid number");
                return res.status(400).json({ error: "Card id must be a number" });
            }

            logger.debug(`Calling CardService with card id ${cardId}`);
            const card = await CardService.findCardByPk(cardId);
            logger.info("Card fetched successfully");

            const cardObj = card.toJSON();
            logger.debug(`Card: ${JSON.stringify(cardObj)}`);

            return res.status(200).json({
                message: "Card fetched successfully",
                cardObj: cardObj,
            });
        } catch (error) {
            if (error instanceof Error) {
                switch (error.name) {
                    case "CardExistsError":
                        logger.error(error.message);
                        return res.status(404).json({ error: error.name });
                    case "CardNotFoundError":
                        logger.error(error.message);
                        return res.status(404).json({ error: error.name });
                    case "MissingAttributesError":
                        logger.error(error.message);
                        return res.status(400).json({ error: error.name });
                    default:
                        logger.error(error.message);
                        return res.status(500).json({ error: "Internal server error" });
                }
            } else {
                logger.error("Something went fantastically wrong. Good luck");
                res.status(500).json({ error: "Internal server error" });
            }
        }
    }

    static async getAllCardsByUser(req: Request, res: Response) {
        try {
            // Getting user from JWT token
            // This is a workaround for error TS2339
            // https://stackoverflow.com/questions/38324949/error-ts2339-property-x-does-not-exist-on-type-y
            const newReq: any = req;
            const user = newReq.user as JwtPayload;

            // Getting user id from user
            const userId = user.id;

            logger.debug(`Calling CardService with user id ${userId}`);
            const cardList = await CardService.findAllCardsByUser(userId);
            logger.info("Card fetched successfully");
            logger.debug(`Card: ${JSON.stringify(cardList)}`);

            return res.status(200).json({
                message: "Card fetched successfully",
                cardList: cardList,
            });
        } catch (error) {
            if (error instanceof Error) {
                switch (error.name) {
                    case "CardExistsError":
                        logger.error(error.message);
                        return res.status(404).json({ error: error.name });
                    case "CardNotFoundError":
                        logger.error(error.message);
                        return res.status(404).json({ error: error.name });
                    case "MissingAttributesError":
                        logger.error(error.message);
                        return res.status(400).json({ error: error.name });
                    default:
                        logger.error(error.message);
                        return res.status(500).json({ error: "Internal server error" });
                }
            } else {
                logger.error("Something went fantastically wrong. Good luck");
                res.status(500).json({ error: "Internal server error" });
            }
        }   
    }
}

export default CardController;
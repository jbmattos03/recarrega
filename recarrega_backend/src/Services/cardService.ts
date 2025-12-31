import Card from "../Models/cardModel"
import TSService from "./TSService";
import TSToUserService from "./TSToUserService";

class CardService {
    // CRUD
    static async createCard(name: string, balance: number, TSId: number, userId: number): Promise<Card> {
        try {
            // Check if card with the same name, TSId and userId already exists
            const existingCard = await Card.findOne({ 
                where: {
                    name: name,
                    TSId: TSId,
                    userId: userId,
                    isDeleted: false   
            }});
            if (existingCard) {
                const err = new Error(`Card name already in use for TSId ${TSId} and userId ${userId}`);
                err.name = "CardExistsError";
                throw err;
            }

            // Create card
            const card = await Card.create({
                name: name,
                balance: balance ?? 0,
                calculatedBalance: balance ?? 0,
                TSId: TSId,
                userId: userId
            });
            return card;
        } catch (error) {
            let err: Error;

            if (error instanceof Error) {
                err = new Error((`Error creating card: ${error.message}`));

                err.name = error.name ?? "Error";
            } else {
                err = new Error("An unknown error has occurred");
            }

            throw err;
        }
    }

    static async updateCard(cardId: number, name: string | undefined, balance: number | undefined): Promise<Card | null> {
        try {
            // Check if card exists
            const card = await Card.findOne({ where: { id: cardId, isDeleted: false } });
            if (!card) {
                const err = new Error("Card not found");
                err.name = "CardNotFoundError";
                throw err;
            }

            // Check if at least one attribute has been provided
            if (!(name || balance)) {
                const err = new Error("At least one attribute must be provided");
                err.name = "MissingAttributesError";
                throw err;
            }

            let updateData: Record<string, any> = {};

            if (name) {
                updateData.name = name;
            }
            if (balance) {
                updateData.balance = balance;
            }

            // Update card
            await card.update(updateData);
            
            // Return updated card
            const updatedCard = await Card.findOne({ where: { id: cardId, isDeleted: false } });
            return updatedCard;
        } catch (error) {
            let err: Error;

            if (error instanceof Error) {
                err = new Error((`Error updating card: ${error.message}`));

                err.name = error.name ?? "Error";
            } else {
                err = new Error("An unknown error has occurred");
            }

            throw err;
        }
    }

    static async deleteCard(cardId: number): Promise<void> {
        try {
            const card = await Card.findOne({ where: { id: cardId, isDeleted: false } });
            if (!card) {
                const err = new Error("Card not found");
                err.name = "CardNotFoundError";
                throw err;
            }

            // 'Delete' card: soft delete
            card.update({ isDeleted: true });
        } catch (error) {
            let err: Error;

            if (error instanceof Error) {
                err = new Error((`Error deleting card: ${error.message}`));

                err.name = error.name ?? "Error";
            } else {
                err = new Error("An unknown error has occurred");
            }

            throw err;
        }
    }

    // Calculate new balance
    static async calculateBalance(cardId: number): Promise<number | undefined> {
        try {
            // Getting card
            const card = await Card.findByPk(cardId);
            if (!card) {
                const err = new Error("Card not found");
                err.name = "CardNotFoundError";
                throw err;
            }

            // Getting TSId and userId from card
            const TSId = card.TSId;
            const userId = card.userId;

            // Getting TUAD and DUAM from TSToUser
            const TSU = await TSToUserService.findTSToUserByTSIdAndUserId(TSId, userId);

            const TUAD = TSU.timesUsedADay;

            // Getting TS fare from TransportationService
            const TS = await TSService.findTSByPk(TSId);

            const fare = TS.fare;

            // Updating calculatedBalance
            let newBalance = card.calculatedBalance - (TUAD * fare);
            await card.update({
                calculatedBalance: newBalance,
            });

            // Returning calculatedBalance
            const updatedCard = await Card.findOne({ where: { id: cardId, isDeleted: false } });
            return updatedCard?.calculatedBalance;
        } catch (error) {
            let err: Error;

            if (error instanceof Error) {
                err = new Error((`Error calculating card balance: ${error.message}`));

                err.name = error.name ?? "Error";
            } else {
                err = new Error("An unknown error has occurred");
            }

            throw err;
        }
    }

    // 'Find by' functions
    static async findCardByPk(cardId: number): Promise<Card> {
        try {
            const card = await Card.findOne({ where: { id: cardId, isDeleted: false } });
            if (!card) {
                const err = new Error("Card not found");
                err.name = "CardNotFoundError";
                throw err;
            }

            return card;
        } catch (error) {
            let err: Error;

            if (error instanceof Error) {
                err = new Error((`Error fetching card: ${error.message}`));

                err.name = error.name ?? "Error";
            } else {
                err = new Error("An unknown error has occurred");
            }

            throw err;
        }
    }

    static async findAllCardsByUser(userId: number): Promise<Card[]> {
        try {
            const cards = await Card.findAll({ where: { userId: userId, isDeleted: false } });
            if (cards.length === 0) {
                const err = new Error(`No cards found for user id ${userId}`);
                err.name = "CardNotFoundError";
                throw err;
            }

            return cards;
        } catch (error) {
            let err: Error;

            if (error instanceof Error) {
                err = new Error((`Error fetching card list: ${error.message}`));

                err.name = error.name ?? "Error";
            } else {
                err = new Error("An unknown error has occurred");
            }

            throw err;
        }
    }
}

export default CardService;
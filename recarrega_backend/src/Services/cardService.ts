import Card from "../Models/cardModel.js"

class CardService {
    // CRUD
    static async createCard(name: string, balance: number, TSId: number, userId: number): Promise<Card> {
        try {
            // Check if card with the same name, TSId and userId already exists
            const existingCard = await Card.findOne({ where: { name: name, TSId: TSId, userId: userId, isDeleted: false } });
            if (existingCard) {
                throw new Error(`Card name already in use for TSId ${TSId} and userId ${userId}`);
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
            const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred";
            throw new Error(`Error creating card: ${errorMessage}`);
        }
    }

    static async updateCard(cardId: number, name: string | undefined, balance: number | undefined): Promise<Card | null> {
        try {
            // Check if card exists
            const card = await Card.findOne({ where: { id: cardId, isDeleted: false } });
            if (!card) {
                throw new Error("Card not found");
            }

            // Check if at least one attribute has been provided
            if (!(name || balance)) {
                throw new Error("At least one attribute must be provided");
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
            const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred";
            throw new Error(`Error updating card: ${errorMessage}`);
        }
    }

    static async deleteCard(cardId: number): Promise<void> {
        try {
            const card = await Card.findOne({ where: { id: cardId, isDeleted: false } });
            if (!card) {
                throw new Error("Card not found");
            }

            // 'Delete' card: soft delete
            card.update({ isDeleted: true });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred";
            throw new Error(`Error deleting card: ${errorMessage}`);
        }
    }

    // 'Find by' functions
    static async findCardByPk(cardId: number): Promise<Card> {
        try {
            const card = await Card.findOne({ where: { id: cardId, idDeleted: false } });
            if (!card) {
                throw new Error("Card not found");
            }

            return card;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred";
            throw new Error(`Error fetching card: ${errorMessage}`);
        }
    }

    static async findAllCardsByUser(userId: number): Promise<Card[]> {
        try {
            const cards = await Card.findAll({ where: { userId: userId, isDeleted: false } });
            if (!cards) {
                throw new Error(`No cards found for user id ${userId}`);
            }

            return cards;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred";
            throw new Error(`Error fetching cards for user id ${userId}: ${errorMessage}`);
        }
    }
}

export default CardService;
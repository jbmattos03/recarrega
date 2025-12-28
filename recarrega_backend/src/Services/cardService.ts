import Card from "../Models/cardModel.js"

class CardService {
    // CRUD
    

    // 'Find by' functions
    static async findCardByPk(cardId: number) {
        try {
            const card = await Card.findOne({ where: { id: cardId, idDeleted: false } });
            if (!card) {
                throw new Error("Card not found");
            }

            return card;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred";
            throw new Error(`Error fetching card: ${errorMessage}`)
        }
    }

    static async findAllCardsByUser(userId: number) {
        try {
            const cards = await Card.findAll({ where: { userId: userId, isDeleted: false } });
            if (!cards) {
                throw new Error(`No cards found for user id ${userId}`);
            }

            return cards;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred";
            throw new Error(`Error fetching cards for user id ${userId}: ${errorMessage}`)
        }
    }
}

export default CardService;
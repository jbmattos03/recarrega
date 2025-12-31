import CardController from "../Controllers/cardController";
import auth from "../Middleware/auth";

const cardRoutes = (app: any) => {
    // Auth protected routes
    // Card routes
    app.get("/cards", auth, CardController.getAllCardsByUser);
    app.get("/cards/:cardId", auth, CardController.getCardById);
    app.delete("/cards/:cardId", auth, CardController.deleteCard);
    app.get("/cards/:cardId/calculate", auth, CardController.calculateBalance);

    // TS related routes
    app.post("/ts/:TSId/cards", auth, CardController.createCard);
    app.put("/ts/:TSId/cards/:cardId", auth, CardController.updateCard);
}

export default cardRoutes;
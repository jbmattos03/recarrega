import express from "express";
import userRoutes from "./Routes/userRoutes";
import TSRoutes from "./Routes/TSRoutes";
import { sequelize, initializeDatabase } from "./Database/database"
import logger from "./Utils/logger";
import dotenv from "dotenv";
import cardRoutes from "./Routes/cardRoutes";
import homeRoute from "./Routes/homeRoute";
dotenv.config();

// Creating Express server
const app = express();
app.use(express.json()); // Server is going to receive info in JSON

// Importing routes
homeRoute(app);
userRoutes(app);
TSRoutes(app);
cardRoutes(app);

// Initializing database with Sequelize
initializeDatabase().then(() => {
    sequelize.sync().then(() => {
            logger.info("Synchronization with the database completed successfully.");

            // Initializing server after database connection
            app.listen(process.env.PORT || 8000, () => {
                logger.info(`Server running on port ${process.env.PORT || 8000}`);
            });
        }
    ).catch((error) => {
        logger.error(`Unable to sync with the database: ${error.message}`);
    });
}).catch((error) => {
    logger.error(`Unable to connect to the database: ${error.message}`);
});
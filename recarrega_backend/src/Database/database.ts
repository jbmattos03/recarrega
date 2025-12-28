import { Sequelize } from "sequelize";
import mysql2 from "mysql2/promise";
import logger from "../Utils/logger.js";
import dotenv from "dotenv";
dotenv.config();

function checkEnvVariables(): boolean {
    if (!(process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD)) {
        return false;
    }

    return true;
}

async function createDatabase(): Promise<void> {
    if (checkEnvVariables()) {
        try {
            const connection = await mysql2.createConnection({
                host: process.env.DB_HOST!,
                user: process.env.DB_USER!,
                password: process.env.DB_PASSWORD!,
            });

            await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);

            logger.info(`Database ${process.env.DB_NAME} created or already exists.`);

            await connection.end();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred";
            logger.error(`Unable to create database: ${errorMessage}`);
        }
    } else {
        throw new Error("DB_HOSR, DB_USER and DB_PASSWORD environment variables are missing or invalid");
    }
}

function createSequelize(): Sequelize {
    if (checkEnvVariables()) {
        const seq = new Sequelize(
            process.env.DB_NAME!,
            process.env.DB_USER!,
            process.env.DB_PASSWORD!,
            {
                host: process.env.DB_HOST!,
                dialect: "mysql",
                timezone: "-03:00",
            }
        );

        return seq;
    } else {
        throw new Error("DB_HOSR, DB_USER and DB_PASSWORD environment variables are missing or invalid");
    }
};

const sequelize = createSequelize();

async function initializeDatabase(): Promise<void> {
    try {
        await createDatabase();
        await sequelize.authenticate();

        logger.info("Successfully connected to the database");
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred"
        logger.error(`Unable to connect to the database: ${errorMessage}`);
    }
}

export { sequelize, initializeDatabase };
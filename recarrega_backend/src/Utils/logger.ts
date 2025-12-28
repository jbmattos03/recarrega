import pino from "pino";
import dotenv from "dotenv";
dotenv.config();

// Logger configuration using pino
const logger = pino({
    level: process.env.LOG_LEVEL || "info",
    timestamp: pino.stdTimeFunctions.isoTime,
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
            translateTime: "SYS:standard",
        }
    }
});

export default logger;
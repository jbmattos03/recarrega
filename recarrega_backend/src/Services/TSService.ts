import TransportationService from "../Models/TSModel";
import { Op, fn, col, where as sequelizeWhere } from "sequelize";

class TSService {
    // CRUD
    static async createTS(name: string, city: string, fare: number): Promise<TransportationService> {
        try {
            // Check if a TS with the same name already exists
            const existingTS = await TransportationService.findOne({ 
                where: {
                    isDeleted: false,
                    [Op.and]: [
                        // Case-insensitive match for name and city
                        sequelizeWhere(fn("LOWER", col("name")), name?.trim().toLowerCase()),
                        sequelizeWhere(fn("LOWER", col("city")), city?.trim().toLowerCase()),
                        // Compare rounded fare to avoid float precision mismatches
                        sequelizeWhere(fn("ROUND", col("fare"), 2), Number(fare.toFixed(2))),
                    ],
            }});
            if (existingTS) {
                const err = new Error("TS already exists");
                err.name = "TSExistsError";
                throw err;
            }

            // Creating user
            const TS = await TransportationService.create({
                name: name,
                city: city,
                fare: fare,
            });
            return TS;
        } catch (error) {
            let err: Error;

            if (error instanceof Error) {
                err = new Error((`Error creating TS: ${error.message}`));

                err.name = error.name ?? "Error";
            } else {
                err = new Error("An unknown error has occurred");
            }

            throw err;
        }
    }

    static async updateTS(TSId: number, name: string | undefined, city: string | undefined, fare: number | undefined): Promise<TransportationService | null> {
        try {
            // Check if the TS exists
            const TS = await TransportationService.findOne({ where: { id: TSId, isDeleted: false } });
            if (!TS) {
                const err = new Error("TS not found");
                err.name = "TSNotFoundError";
                throw err;
            }

            // Check if any attributes were provided
            if (!(name || fare)) {
                const err = new Error("At least one attribute must be provided");
                err.name = "MissingAttributesError";
                throw err;
            }
            
            let updateData: Record<string, any> = {};

            if (name) {
                updateData.name = name;
            }
            if (city) {
                updateData.city = city;
            }
            if (fare) {
                updateData.fare = fare;
            }
            
            // Check if a TS with these attributes already exists
            const existingTS = await TransportationService.findOne({ 
                where: {
                    isDeleted: false,
                    [Op.and]: [
                        // Case-insensitive match for name and city
                        sequelizeWhere(fn("LOWER", col("name")), name?.trim().toLowerCase()),
                        sequelizeWhere(fn("LOWER", col("city")), city?.trim().toLowerCase()),
                        // Compare rounded fare to avoid float precision mismatches
                        sequelizeWhere(fn("ROUND", col("fare"), 2), Number(fare?.toFixed(2))),
                    ],
            }});
            if (existingTS) {
                const err = new Error("TS already exists");
                err.name = "TSExistsError";
                throw err;
            }

            // Update TS
            await TS.update(updateData);
            
            // Fetch updated TS
            const updatedTS = await TransportationService.findOne({ where: { id: TSId, isDeleted: false } });
            return updatedTS;
        } catch (error) {
            let err: Error;

            if (error instanceof Error) {
                err = new Error((`Error updating TS: ${error.message}`));

                err.name = error.name ?? "Error";
            } else {
                err = new Error("An unknown error has occurred");
            }

            throw err;
        }
    }

    static async deleteTS(TSId: number): Promise<void> {
        try {
            // Check if TS exists
            const TS = await TransportationService.findOne({ where: { id: TSId, isDeleted: false } });
            if (!TS) {
                const err = new Error("TS not found");
                err.name = "TSNotFoundError";
                throw err;
            }

            // 'Delete' TS: soft delete
            await TS.update({ isDeleted: true });
        } catch (error) {
            let err: Error;

            if (error instanceof Error) {
                err = new Error((`Error deleting TS: ${error.message}`));

                err.name = error.name ?? "Error";
            } else {
                err = new Error("An unknown error has occurred");
            }

            throw err;
        }
    }

    // 'Find by' functions
    static async findTSByPk(TSId: number): Promise<TransportationService> {
        try {
            const TS = await TransportationService.findOne({ where: { id: TSId, isDeleted: false } });
            if (!TS) {
                const err = new Error("TS not found");
                err.name = "TSNotFoundError";
                throw err;
            }

            return TS;
        } catch (error) {
            let err: Error;

            if (error instanceof Error) {
                err = new Error((`Error fetching TS: ${error.message}`));

                err.name = error.name ?? "Error";
            } else {
                err = new Error("An unknown error has occurred");
            }

            throw err;
        }
    }

    static async findTSByNameCityAndFare(name: string, city: string, fare: number): Promise<TransportationService | null> {
        try {
            const TS = await TransportationService.findOne({
                where: {
                    isDeleted: false,
                    [Op.and]: [
                        // Case-insensitive match for name and city
                        sequelizeWhere(fn("LOWER", col("name")), name?.trim().toLowerCase()),
                        sequelizeWhere(fn("LOWER", col("city")), city?.trim().toLowerCase()),
                        // Compare rounded fare to avoid float precision mismatches
                        sequelizeWhere(fn("ROUND", col("fare"), 2), Number(fare.toFixed(2))),
                    ],
            }});

            return TS;
        } catch (error) {
            let err: Error;

            if (error instanceof Error) {
                err = new Error((`Error fetching TS: ${error.message}`));

                err.name = error.name ?? "Error";
            } else {
                err = new Error("An unknown error has occurred");
            }

            throw err;
        }
    }

    static async findAllTSByName(name: string): Promise<TransportationService[]> {
        try {
            const TSList = await TransportationService.findAll({ where: { name: name, isDeleted: false } });
            if (TSList.length === 0) {
                const err = new Error(`No TS found with name ${name}`);
                err.name = "TSNotFoundError";
                throw err;
            }

            return TSList;
        } catch (error) {
            let err: Error;

            if (error instanceof Error) {
                err = new Error((`Error fetching TS list: ${error.message}`));

                err.name = error.name ?? "Error";
            } else {
                err = new Error("An unknown error has occurred");
            }

            throw err;
        }
    }

    static async findAllTSByNameAndCity(name: string, city: string): Promise<TransportationService[]> {
        try {
            const TSlist = await TransportationService.findAll({ 
                where: {
                    isDeleted: false,
                    [Op.and]: [
                        // Case-insensitive match for name and city
                        sequelizeWhere(fn("LOWER", col("name")), name?.trim().toLowerCase()),
                        sequelizeWhere(fn("LOWER", col("city")), city?.trim().toLowerCase()),
                    ],
            }});
            if (TSlist.length === 0) {
                throw new Error(`No TS found with name ${name} and city ${city}`).name = "TSNotFoundError";
            }

            return TSlist;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred";
            throw new Error(`Error fetching TS list: ${errorMessage}`);
        }
    }

    static async findAllTS(): Promise<TransportationService[]> {
        try {
            const TSList = await TransportationService.findAll();
            if (TSList.length === 0) {
                const err = new Error(`No TS found`);
                err.name = "TSNotFoundError";
                throw err;
            }

            return TSList;
        } catch (error) {
            let err: Error;

            if (error instanceof Error) {
                err = new Error((`Error fetching TS list: ${error.message}`));

                err.name = error.name ?? "Error";
            } else {
                err = new Error("An unknown error has occurred");
            }

            throw err;
        }
    }
}

export default TSService;
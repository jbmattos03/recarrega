import TSToUser from "../Models/TSToUserModel";

class TSToUserService {
    // CRUD
    static async createTSToUser(TSId: number, userId: number, timesUsedADay: number, daysUsedAMonth: number): Promise<TSToUser> {
        try {
            // Check if TSToUser instance already exists
            const existingTSToUser = await TSToUser.findOne({ where: { TSId: TSId, userId: userId, isDeleted: false } });
            if (existingTSToUser) {
                const err = new Error(`TSId ${TSId} already associated with user ${userId}`);
                err.name = "TSUExistsError"
                throw err;
            }

            // Create TSToUser instance
            const TSUser = await TSToUser.create({
                TSId: TSId,
                userId: userId,
                timesUsedADay: timesUsedADay,
                daysUsedAMonth: daysUsedAMonth,
            });
            return TSUser;
        } catch (error) {
            let err: Error;

            if (error instanceof Error) {
                err = new Error((`Error creating TSU: ${error.message}`));

                err.name = error.name ?? "Error";
            } else {
                err = new Error("An unknown error has occurred");
            }

            throw err;
        }
    }

    static async updateTSToUser(TSId: number, userId: number, timesUsedADay: number | undefined, daysUsedAMonth: number | undefined): Promise<TSToUser | null> {
        try {
            // Check if TSToUser instance already exists
            const TSUser = await TSToUser.findOne({ where: { TSId: TSId, userId: userId, isDeleted: false } });
            if (!TSUser) {
                const err = new Error(`TSId ${TSId} not associated with user ${userId}`);
                err.name = "TSUNotFoundError";
                throw err;

            }

            let updateData: Record<string, any> = {};

            if (timesUsedADay) {
                updateData.timesUsedADay = timesUsedADay;
            }
            if (daysUsedAMonth) {
                updateData.daysUsedAMonth = daysUsedAMonth;
            }

            // Update TSToUser
            await TSUser.update(updateData);

            // Return updated TSUser instance
            const updatedTSUser = await TSToUser.findOne({ 
                where: { 
                    TSId: TSId,
                    userId: userId,
                    isDeleted: false, 
            }});
            return updatedTSUser;
        } catch (error) {
            let err: Error;

            if (error instanceof Error) {
                err = new Error((`Error updating TSU: ${error.message}`));

                err.name = error.name ?? "Error";
            } else {
                err = new Error("An unknown error has occurred");
            }

            throw err;
        }
    }

    static async deleteTSToUser(TSId: number, userId: number) {
        try {
            // Check if TSU instance exists
            const TSUser = await TSToUser.findOne({ where: { TSId: TSId, userId: userId, isDeleted: false } });
            if (!TSUser) {
                const err =  new Error("No TSU found");
                err.name = "TSUNotFoundError"
                throw err;
            }

            // 'Delete' TSU: soft delete
            await TSUser.update({ isDeleted: true });
        } catch (error) {
            let err: Error;

            if (error instanceof Error) {
                err = new Error((`Error deleting TSU: ${error.message}`));

                err.name = error.name ?? "Error";
            } else {
                err = new Error("An unknown error has occurred");
            }

            throw err;
        }
    }

    // 'Find by' functions
    static async findAllTSUByUser(userId: number): Promise<TSToUser[]> {
        try {
            const TSUByUser = await TSToUser.findAll({ where: { userId: userId, isDeleted: false } });
            if (!TSUByUser) {
                const err =  new Error(`No TSs found for user id ${userId}`);
                err.name = "TSUNotFoundError";
                throw err;
            }

            return TSUByUser;
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

    static async findTSToUserByTSIdAndUserId(TSId: number, userId: number): Promise<TSToUser> {
        try {
            const TSU = await TSToUser.findOne({ where: { userId: userId, TSId: TSId, isDeleted: false } });
            if (!TSU) {
                const err = new Error("TSU not found");
                err.name = "TSUNotFoundError";
                throw err;
            }

            return TSU;
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

export default TSToUserService;
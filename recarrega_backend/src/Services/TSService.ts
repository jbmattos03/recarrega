import TransportationService from "../Models/TSModel.js";

class TSService {
    // CRUD
    static async createTS(name: string, fare: number): Promise<TransportationService | undefined> {
        try {
            // Check if a TS with the same name already exists
            const existingTS = await TransportationService.findOne({ where: { name: name, isDeleted: false } });
            if (existingTS) {
                throw new Error("TS name already in use")
            }

            // Creating user
            const TS = await TransportationService.create({
                name: name,
                fare: fare
            });

            return TS;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred";
            throw new Error(`Error creating TS: ${errorMessage}`);
        }
    }

    static async updateTS(TSId: number, name: string | undefined, fare: number | undefined) {
        try {
            // Check if the TS exists
            const TS = await TransportationService.findByPk(TSId);
            if (!TS) {
                throw new Error("TS not found");
            }

            // Check if any attributes were provided
            if (!(name || fare)) {
                throw new Error("At least one attribute must be provided")
            }
            
            let updateData: Record<string, any> = {};

            if (name) {
                updateData.name = name;
            } 
            if (fare) {
                updateData.fare = fare;
            }
            
            // Update TS
            await TS.update(updateData);
            
            // Fetch updated TS
            const updatedTS = await TransportationService.findByPk(TSId);
            return updatedTS;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred";
            throw new Error(`Error updating TS: ${errorMessage}`);
        }
    }

    static async deleteTS(TSId: number) {
        try {
            // Check if TS exists
            const TS = await TransportationService.findOne({ where: { id: TSId, isDeleted: false } });
            if (!TS) {
                throw new Error("TS not found");
            }

            // 'Delete' TS: soft delete
            await TS.update({ isDeleted: true });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred";
            throw new Error(`Error deleting TS: ${errorMessage}`);
        }
    }

    // 'Find by' functions
    static async findTSByPk(TSId: number) {
        try {
            const TS = TransportationService.findByPk(TSId);
            if (!TS) {
                throw new Error("TS not found")
            }

            return TS;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred";
            throw new Error(`Error fetching task: ${errorMessage}`);
        }
    }
}

export default TSService;
import User from "../Models/userModel.js"
import bcrypt from "bcrypt";

class UserService {
    // CRUD
    static async createUser(name: string, email: string, password: string): Promise<User> {
        try {
            // Check if email is already being used
            const existingUser = await User.findOne({ where: { email: email, isDeleted: false } });
            if (existingUser) {
                throw new Error("E-mail is already in use")
            }

            // Hashing the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Creating user
            const user = await User.create({
                name: name,
                email: email,
                password: hashedPassword
            });
            return user;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred";
            throw new Error(`Error creating user: ${errorMessage}`);
        }
    }

    static async updateUser(userId: number, name: string | undefined, email: string | undefined): Promise<User | null> {
        try {
            // Check if user exists
            const user = await User.findOne({ where: { id: userId, isDeleted: false } });
            if (!user) {
                throw new Error("User not found");
            }

            // Check if any attributes were provided
            if (!(name || email)) {
                throw new Error("At least one attribute must be provided")
            }

            let updateData: Record<string, any> = {};

            if (name) {
                updateData.name = name;
            }
            if (email) {
                updateData.email = email;
            }

            // Update user
            await user.update(updateData);

            // Fetch the updated user
            const updatedUser = await User.findOne({ where: { id: userId, isDeleted: false } });
            return updatedUser;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred";
            throw new Error(`Error updating user: ${errorMessage}`);
        }
    }

    static async deleteUser(userId: number): Promise<void> {
        try {
            const user = await User.findOne({ where: { id: userId, isDeleted: false } });
            if (!user) {
                throw new Error("User not found");
            }
            
            // 'Delete' user: soft delete
            await user.update({ isDeleted: true });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred";
            throw new Error(`Error deleting user: ${errorMessage}`);
        }
    }

    // 'Find by' functions
    static async findUserByPk(userId: number): Promise<User> {
        try {
            const user = await User.findOne({ where: { id: userId, isDeleted: false } });
            if (!user) {
                throw new Error("User not found");
            }

            return user;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred";
            throw new Error(`Error fetching user by pk: ${errorMessage}`);
        }
    }

    static async findUserByEmail(email: string): Promise<User> {
        try {
            const user = await User.findOne({ where: { email: email, isDeleted: false } });
            if (!user) {
                throw new Error("User not found");
            }

            return user;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred";
            throw new Error(`Error fetching user by email: ${errorMessage}`);
        }
    }
}

export default UserService;
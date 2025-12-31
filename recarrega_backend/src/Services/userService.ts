import User from "../Models/userModel"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()

class UserService {
    // CRUD
    static async createUser(name: string, email: string, password: string): Promise<User> {
        try {
            // Check if email is already being used
            const existingUser = await User.findOne({ where: { email: email, isDeleted: false } });
            if (existingUser) {
                const err =  new Error("E-mail is already in use");
                err.name = "UserExistsError";
                throw err;

            }

            // Hashing the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Creating user
            const user = await User.create({
                name: name,
                email: email,
                password: hashedPassword,
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
                const err =  new Error("User not found");
                err.name = "UserNotFoundError";
                throw err;
            }

            // Check if any attributes were provided
            if (!(name || email)) {
                const err = new Error("At least one attribute must be provided");
                err.name = "MissingAttributesError";
                throw err;
            }

            let updateData: Record<string, any> = {};

            if (name) {
                updateData.name = name;
            }
            if (email) {
                // Check if a user with this email already exists
                const existinguser = await User.findOne({ where: { email: email } });
                if (existinguser) {
                    const err =  new Error("E-mail already in use");
                    err.name = "UserExistsError";
                    throw err;
                }
                
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
                const err =  new Error("User not found");
                err.name = "UserNotFoundError";
                throw err;
            }
            
            // 'Delete' user: soft delete
            await user.update({ isDeleted: true });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred";
            throw new Error(`Error deleting user: ${errorMessage}`);
        }
    }

    // Login
    static async loginUser(email: string, password: string): Promise<string> {
        try {
            // Checking if user exists
            const user = await User.findOne({ where: { email: email } });
            if (!user) {
                const err = new Error("User not found");
                err.name = "UserNotFoundError";
                throw err;
            }

            // Comparing stored password with received password
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                // Creating jwt token
                const token = jwt.sign({
                    id: user.id,
                    email: user.email,
                },
                process.env.JWT_SECRET!, // Trust me bro; if JWT_SECRET hasn't been set, it will get caught before runtime gets here
                { expiresIn: "1h" }
                );

                return token;
            } else {
                const err = new Error("Invalid email or password");
                err.name = "InvalidCredentialsError";
                throw err;
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred";
            throw new Error(`Error logging user in: ${errorMessage}`);
        }
    }

    // 'Find by' functions
    static async findUserByPk(userId: number): Promise<User> {
        try {
            const user = await User.findOne({ where: { id: userId, isDeleted: false } });
            if (!user) {
                const err = new Error("User not found");
                err.name = "UserNotFoundError";
                throw err;
            }

            return user;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred";
            throw new Error(`Error fetching user: ${errorMessage}`);
        }
    }

    static async findUserByEmail(email: string): Promise<User> {
        try {
            const user = await User.findOne({ where: { email: email, isDeleted: false } });
            if (!user) {
                const err = new Error("User not found");
                err.name = "UserNotFoundError";
                throw err;
            }

            return user;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred";
            throw new Error(`Error fetching user: ${errorMessage}`);
        }
    }
}

export default UserService;
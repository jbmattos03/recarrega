import { DataTypes, Model } from "sequelize";
import { sequelize } from "../Database/database"

class User extends Model {
    // MODEL SPECIFIC ATTRIBUTES
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public isAdmin!: boolean;
    public isDeleted!: boolean;

    // TIMESTAMPS
    // createdAt can be undefined during creation
    public createdAt!: Date;
    // updatedAt can be undefined during creation
    public updatedAt!: Date;

    static associate(models: any) {
        this.hasMany(models.TSToUser, {
            foreignKey: {
                name: "userId",
                allowNull: true, // User may not use a transportation service
            },
            onDelete: "CASCADE", 
            onUpdate: "CASCADE",
            as: "TSs"
        });

        this.hasMany(models.Card, {
            foreignKey: {
                name: "userId",
                allowNull: true, // User may not have a card
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            as: "cards"
        });
    }
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    sequelize,
    modelName: "User",
    tableName: "User",
    timestamps: true,
});

export default User;
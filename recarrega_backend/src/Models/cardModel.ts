import { Model, DataTypes } from "sequelize";
import { sequelize } from "../Database/database.js";

class Card extends Model {
    // MODEL SPECIFIC ATTRIBUTES
    public id!: number;
    public name!: string;
    public balance!: number;
    public calculatedBalance!: number;
    public TSId!: number; // Foreign key
    public userId!: number;
    public isDeleted!: boolean;

    // TIMESTAMPS
    // createdAt can be undefined during creation
    public createdAt!: Date;
    // updatedAt can be undefined during creation
    public updatedAt!: Date;

    static associate(models: any) {
        this.belongsTo(models.TransportationService, {
            foreignKey: {
                name: "TSId",
                allowNull: false, // Card must have a TS associated with it
            },
            onDelete: "CASCADE", 
            onUpdate: "CASCADE",
            as: "TS"
        });

        this.belongsTo(models.User, {
            foreignKey: {
                name: "userId",
                allowNull: false, // Card must have a user associated with it
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            as: "user"
        });
    }
}

Card.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    balance: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    calculatedBalance: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    TSId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    sequelize,
    modelName: "Card",
    tableName: "Card",
    timestamps: true
})

export default Card;
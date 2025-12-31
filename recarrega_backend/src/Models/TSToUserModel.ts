import { Model, DataTypes } from "sequelize";
import { sequelize } from "../Database/database";

class TSToUser extends Model {
    // MODEL SPECIFIC ATTRIBUTES
    public userId!: number; // Foreign key
    public TSId!: number; // Foreign key
    public timesUsedADay!: number;
    public daysUsedAMonth!: number;
    public isDeleted!: boolean;

    // TIMESTAMPS
    // createdAt can be undefined during creation
    public createdAt!: Date;
    // updatedAt can be undefined during creation
    public updatedAt!: Date;

    // ASSOCIATIONS
    static associate(models: any) {
        this.belongsTo(models.TransportationService, {
            foreignKey: {
                name: "TSId",
                allowNull: true, // TS may not have users
            },
            onDelete: "CASCADE", 
            onUpdate: "CASCADE",
            as: "TS"
        });

        this.belongsTo(models.User, {
            foreignKey: {
                name: "userId",
                allowNull: true, // User may not use a TS
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            as: "user"
        });
    }
}

TSToUser.init({
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    TSId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    timesUsedADay: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    daysUsedAMonth: {
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
    modelName: "TSToUser",
    tableName: "TSToUser",
    timestamps: true,
});

export default TSToUser;
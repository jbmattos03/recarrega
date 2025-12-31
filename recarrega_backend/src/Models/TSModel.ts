import { Model, DataTypes } from "sequelize";
import { sequelize } from "../Database/database";

class TransportationService extends Model {
    // MODEL SPECIFIC ATTRIBUTES
    public id!: number;
    public name!: string;
    public city!: string;
    public fare!: number;
    public isDeleted!: boolean;

    // TIMESTAMPS
    // createdAt can be undefined during creation
    public createdAt!: Date;
    // updatedAt can be undefined during creation
    public updatedAt!: Date;

    static associate(models: any) {
        this.hasMany(models.TSToUser, {
            foreignKey: {
                name: "tsId",
                allowNull: true, // User may not use a transportation service
            },
            onDelete: "CASCADE", 
            onUpdate: "CASCADE",
            as: "users"
        });


        this.hasMany(models.Card, {
            foreignKey: {
                name: "tsId",
                allowNull: true, // TS may not have a card associated with it
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            as: "card"
        });
    }
}

TransportationService.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fare: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    sequelize,
    modelName: "TransportationService",
    tableName: "TransportationService",
    timestamps: true,
})

export default TransportationService;
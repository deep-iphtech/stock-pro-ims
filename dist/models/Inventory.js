import { DataTypes, Model, } from "@sequelize/core";
export class Inventory extends Model {
    static initModel(sequelize) {
        Inventory.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            warehouse_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            available: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            reserved: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
        }, {
            sequelize,
            modelName: "Inventory",
            tableName: "ims_inventory",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        });
    }
}

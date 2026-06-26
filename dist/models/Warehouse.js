import { DataTypes, Model } from "@sequelize/core";
export class Warehouse extends Model {
    static initModel(sequelize) {
        Warehouse.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        }, {
            sequelize,
            modelName: "Warehouse",
            tableName: "ims_warehouses",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        });
    }
}

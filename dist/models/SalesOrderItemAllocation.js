import { DataTypes, Model } from "@sequelize/core";
export class SalesOrderItemAllocation extends Model {
    static initModel(sequelize) {
        SalesOrderItemAllocation.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            sales_order_item_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            warehouse_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        }, {
            sequelize,
            modelName: "SalesOrderItemAllocation",
            tableName: "apd_sales_order_item_allocations",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        });
    }
}

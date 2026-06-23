import { DataTypes, Model } from "@sequelize/core";
export class SalesOrderItem extends Model {
    static initModel(sequelize) {
        SalesOrderItem.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            sales_order_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            pricing_tier: {
                type: DataTypes.ENUM("retail", "wholesale", "distributor", "t1", "t2", "t3"),
                allowNull: false,
            },
            price: {
                type: DataTypes.DECIMAL(12, 2),
                allowNull: false,
            },
        }, {
            sequelize,
            modelName: "SalesOrderItem",
            tableName: "apd_sales_order_items",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        });
    }
}

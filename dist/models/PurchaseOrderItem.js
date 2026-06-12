import { DataTypes, Model } from "@sequelize/core";
export class PurchaseOrderItem extends Model {
    static initModel(sequelize) {
        PurchaseOrderItem.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            purchase_order_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    table: "apd_purchase_orders",
                    key: "id",
                },
                onDelete: "CASCADE",
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
                type: DataTypes.ENUM("retail", "wholesale", "distributor"),
                allowNull: false,
            },
            price: {
                type: DataTypes.DECIMAL(12, 2),
                allowNull: false,
            },
            warehouse_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        }, {
            sequelize,
            modelName: "PurchaseOrderItem",
            tableName: "apd_purchase_order_items",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        });
    }
}

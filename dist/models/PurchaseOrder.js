import { DataTypes, Model, } from "@sequelize/core";
export class PurchaseOrder extends Model {
    static initModel(sequelize) {
        PurchaseOrder.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            order_number: {
                type: DataTypes.STRING(50),
                allowNull: true,
                unique: true,
            },
            business_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM("draft", "pending", "approved", "received", "cancelled"),
                defaultValue: "draft",
            },
            shipping_charges: {
                type: DataTypes.DECIMAL(12, 2),
                defaultValue: 0,
            },
            notes: {
                type: DataTypes.TEXT,
            },
            created_by: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            payment_status: {
                type: DataTypes.ENUM("pending", "partial", "paid"),
                defaultValue: "pending",
            },
            paid_at: {
                type: DataTypes.DATE,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: null,
            },
        }, {
            sequelize,
            tableName: "apd_purchase_orders",
            timestamps: false,
            hooks: {
                beforeUpdate: (purchaseOrder) => {
                    purchaseOrder.setDataValue("updated_at", new Date());
                },
            },
        });
    }
}

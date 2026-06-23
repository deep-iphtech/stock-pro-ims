import { DataTypes, Model } from "@sequelize/core";
export class SalesOrder extends Model {
    static initModel(sequelize) {
        SalesOrder.init({
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
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM("draft", "pending", "confirmed", "processing", "shipped", "completed", "cancelled"),
                defaultValue: "draft",
            },
            invoice_date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            shipping_charges: {
                type: DataTypes.DECIMAL(12, 2),
                defaultValue: 0,
            },
            notes: {
                type: DataTypes.STRING(1000),
                allowNull: true,
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
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            drop_ship_contact: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            shipping_address: {
                type: DataTypes.STRING(500),
                allowNull: true,
            },
        }, {
            sequelize,
            modelName: "SalesOrder",
            tableName: "apd_sales_orders",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        });
    }
}

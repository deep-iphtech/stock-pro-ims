import { DataTypes, Model, } from "sequelize";
export class Orders extends Model {
    static initModel(sequelize) {
        Orders.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            customer_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            order_type: {
                type: DataTypes.ENUM("sales", "purchase"),
                allowNull: false,
                defaultValue: "sales",
            },
            order_number: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true,
            },
            shipment_tracking_number: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM("draft", "pending", "approved", "received", "cancelled"),
                defaultValue: "draft",
            },
            notes: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            payment_status: {
                type: DataTypes.ENUM("pending", "partial", "paid"),
                defaultValue: "pending",
            },
            paid_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            order_meta: {
                type: DataTypes.JSONB,
                allowNull: true,
            },
            shipping_charges: {
                type: DataTypes.DECIMAL(12, 2),
                defaultValue: 0,
            },
            discount: {
                type: DataTypes.INTEGER,
                allowNull: true,
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
            tableName: "ims_orders",
            timestamps: false,
            hooks: {
                beforeUpdate: (purchaseOrder) => {
                    purchaseOrder.setDataValue("updated_at", new Date());
                },
            },
        });
    }
}

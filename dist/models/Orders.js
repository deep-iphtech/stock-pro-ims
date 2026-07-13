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
                type: DataTypes.ENUM("0", "1", "2", "3", "4", "5", "6", "7"),
                defaultValue: "1",
                // comment:
                //   "Order Status: 0 = Cancelled (order terminated), 1 = Created (new order), 2 = Draft (not finalized), 3 = Confirmed (approved for processing), 4 = In Shipment (currently being transported), 5 = Ready to Ship (packed and awaiting dispatch), 6 = Shipped (dispatched to carrier), 7 = Completed (successfully delivered and closed).",
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
            total_amount: {
                type: DataTypes.STRING,
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

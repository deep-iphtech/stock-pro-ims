import { DataTypes, Model } from "sequelize";
export class OrderItems extends Model {
    static initModel(sequelize) {
        OrderItems.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            order_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "ims_orders",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            warehouse_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "ims_warehouses",
                    key: "id",
                },
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            quantity_allocation: { type: DataTypes.STRING, allowNull: true },
            price: {
                type: DataTypes.DECIMAL(12, 2),
                allowNull: false,
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
            modelName: "OrderItems",
            tableName: "ims_order_items",
            timestamps: false,
            hooks: {
                beforeUpdate: (purchaseOrder) => {
                    purchaseOrder.setDataValue("updated_at", new Date());
                },
            },
        });
    }
}

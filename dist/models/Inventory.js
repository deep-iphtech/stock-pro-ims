import { DataTypes, Model, } from "sequelize";
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
            available_qty: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            purchase_qty: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            reserved_qty: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
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
            modelName: "Inventory",
            tableName: "ims_inventory",
            timestamps: false,
            hooks: {
                beforeUpdate: (purchaseOrder) => {
                    purchaseOrder.setDataValue("updated_at", new Date());
                },
            },
        });
    }
}

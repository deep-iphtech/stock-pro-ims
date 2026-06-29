import { DataTypes, Model } from "sequelize";
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
            modelName: "Warehouse",
            tableName: "ims_warehouses",
            timestamps: false,
            hooks: {
                beforeUpdate: (purchaseOrder) => {
                    purchaseOrder.setDataValue("updated_at", new Date());
                },
            },
        });
    }
}

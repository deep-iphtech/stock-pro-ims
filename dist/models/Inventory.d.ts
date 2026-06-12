import { Model, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from "@sequelize/core";
export declare class Inventory extends Model<InferAttributes<Inventory>, InferCreationAttributes<Inventory>> {
    id: CreationOptional<number>;
    product_id: number;
    warehouse_id: number;
    available: CreationOptional<number>;
    reserved: CreationOptional<number>;
    static initModel(sequelize: Sequelize): void;
}
//# sourceMappingURL=Inventory.d.ts.map
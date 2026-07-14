import { CreationOptional, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
export declare class Inventory extends Model<InferAttributes<Inventory>, InferCreationAttributes<Inventory>> {
    id: CreationOptional<number>;
    product_id: number;
    warehouse_id: number;
    available_qty: number;
    reserved_qty: CreationOptional<number>;
    purchase_qty: CreationOptional<number>;
    created_at: CreationOptional<Date>;
    updated_at: Date | null;
    static initModel(sequelize: Sequelize): void;
}

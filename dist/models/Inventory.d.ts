import { CreationOptional, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
export declare class Inventory extends Model<InferAttributes<Inventory>, InferCreationAttributes<Inventory>> {
    id: CreationOptional<number>;
    product_id: number;
    warehouse_id: number;
    available: CreationOptional<number>;
    reserved: CreationOptional<number>;
    static initModel(sequelize: Sequelize): void;
}

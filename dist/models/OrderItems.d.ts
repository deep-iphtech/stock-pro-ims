import { CreationOptional, Model, Sequelize } from "sequelize";
export declare class OrderItems extends Model {
    id: number;
    order_id: number;
    product_id: number;
    quantity_allocation: string;
    quantity: number | string;
    created_at: CreationOptional<Date>;
    static initModel(sequelize: Sequelize): void;
}

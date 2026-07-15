import { Model, Sequelize } from "sequelize";
export declare class OrderItems extends Model {
    id: number;
    order_id: number;
    product_id: number;
    quantity_allocation: string;
    static initModel(sequelize: Sequelize): void;
}

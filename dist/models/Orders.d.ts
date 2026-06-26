import { CreationOptional, InferAttributes, InferCreationAttributes, Model, Sequelize } from "@sequelize/core";
export declare class Orders extends Model<InferAttributes<Orders>, InferCreationAttributes<Orders>> {
    id: CreationOptional<number>;
    customer_id: number;
    order_number?: string;
    order_type: CreationOptional<"sales" | "purchase">;
    status: CreationOptional<"draft" | "pending" | "approved" | "received" | "cancelled">;
    shipping_charges: CreationOptional<number>;
    notes: string | null;
    payment_status: CreationOptional<"pending" | "partial" | "paid">;
    paid_at: Date | null;
    created_at: CreationOptional<Date>;
    updated_at: Date | null;
    static initModel(sequelize: Sequelize): void;
}
//# sourceMappingURL=Orders.d.ts.map
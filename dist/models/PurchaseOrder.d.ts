import { CreationOptional, InferAttributes, InferCreationAttributes, Model, Sequelize } from "@sequelize/core";
export declare class PurchaseOrder extends Model<InferAttributes<PurchaseOrder>, InferCreationAttributes<PurchaseOrder>> {
    id: CreationOptional<number>;
    order_number?: string;
    business_id: number;
    status: CreationOptional<"draft" | "pending" | "approved" | "received" | "cancelled">;
    shipping_charges: CreationOptional<number>;
    notes: string | null;
    created_by: number;
    payment_status: CreationOptional<"pending" | "partial" | "paid">;
    paid_at: Date | null;
    created_at: CreationOptional<Date>;
    updated_at: Date | null;
    static initModel(sequelize: Sequelize): void;
}
//# sourceMappingURL=PurchaseOrder.d.ts.map
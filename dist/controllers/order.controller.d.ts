import { AutoPoolDB } from "../core/types.js";
import { createOrderBody } from "../types/order.js";
type CreateOrderResult = {
    order_id: number | null;
    order_number?: string | null;
};
export declare function createOrder(db: AutoPoolDB, payload: createOrderBody): Promise<CreateOrderResult>;
export {};

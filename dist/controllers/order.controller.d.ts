import { AutoPoolDB } from "../core/types.js";
import { createOrderBody } from "../types/order.js";
type CreateOrderResult = {
    order_id: number;
    order_number?: string;
};
export declare function createOrder(db: AutoPoolDB, payload: createOrderBody): Promise<CreateOrderResult>;
export {};

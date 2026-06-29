import { AutoPoolDB } from "../core/types.js";
import { createOrderBody } from "../types/order.js";
type CreatePurchaseOrderResult = {
    order_id: number;
    order_number?: string;
};
export declare function createPurchaseOrderWithItems(db: AutoPoolDB, payload: createOrderBody): Promise<CreatePurchaseOrderResult>;
export {};
//# sourceMappingURL=order.controller.d.ts.map
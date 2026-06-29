import { OrderItems } from "../../models/OrderItems.js";
import { BaseService } from "../base/base.service.js";
export declare class PurchaseOrderItemService extends BaseService<OrderItems> {
    constructor();
    findByOrder(orderId: number): Promise<OrderItems[]>;
}
declare const _default: PurchaseOrderItemService;
export default _default;
//# sourceMappingURL=purchase_order_items.service.d.ts.map
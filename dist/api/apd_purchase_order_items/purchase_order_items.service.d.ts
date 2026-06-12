import { PurchaseOrderItem } from "../../models/PurchaseOrderItem.js";
import { BaseService } from "../base/base.service.js";
export declare class PurchaseOrderItemService extends BaseService<PurchaseOrderItem> {
    constructor();
    findByOrder(orderId: number): Promise<PurchaseOrderItem[]>;
}
declare const _default: PurchaseOrderItemService;
export default _default;
//# sourceMappingURL=purchase_order_items.service.d.ts.map
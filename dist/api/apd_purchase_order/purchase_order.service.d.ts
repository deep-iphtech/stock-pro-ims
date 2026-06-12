import { PurchaseOrder } from "../../models/PurchaseOrder.js";
import { BaseService } from "../base/base.service.js";
export declare class PurchaseOrderService extends BaseService<PurchaseOrder> {
    constructor();
    findWithItems(id: number): Promise<PurchaseOrder | null>;
}
declare const _default: PurchaseOrderService;
export default _default;
//# sourceMappingURL=purchase_order.service.d.ts.map
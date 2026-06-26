import { Orders } from "../../models/Orders.js";
import { BaseService } from "../base/base.service.js";
export declare class PurchaseOrderService extends BaseService<Orders> {
    constructor();
    findWithItems(id: number): Promise<Orders | null>;
}
declare const _default: PurchaseOrderService;
export default _default;
//# sourceMappingURL=purchase_order.service.d.ts.map
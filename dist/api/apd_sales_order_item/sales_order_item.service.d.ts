import { SalesOrderItem } from "../../models/SalesOrderItem.js";
import { BaseService } from "../base/base.service.js";
export declare class SalesOrderItemService extends BaseService<SalesOrderItem> {
    constructor();
    findByOrder(orderId: number): Promise<SalesOrderItem[]>;
}
declare const _default: SalesOrderItemService;
export default _default;
//# sourceMappingURL=sales_order_item.service.d.ts.map
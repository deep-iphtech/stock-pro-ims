import { OrderItems } from "../../models/OrderItems.js";
import { BaseService } from "../base/base.service.js";
export declare class SalesOrderItemService extends BaseService<OrderItems> {
    constructor();
    findByOrder(orderId: number): Promise<OrderItems[]>;
}
declare const _default: SalesOrderItemService;
export default _default;
//# sourceMappingURL=sales_order_item.service.d.ts.map
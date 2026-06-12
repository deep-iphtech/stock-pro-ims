import { SalesOrder } from "../../models/SalesOrder.js";
import { BaseService } from "../base/base.service.js";
export declare class SalesOrderService extends BaseService<SalesOrder> {
    constructor();
    findWithItems(id: number): Promise<SalesOrder | null>;
}
declare const _default: SalesOrderService;
export default _default;
//# sourceMappingURL=sales_order.service.d.ts.map
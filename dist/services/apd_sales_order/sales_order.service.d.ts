import { Orders } from "../../models/Orders.js";
import { BaseService } from "../base/base.service.js";
export declare class SalesOrderService extends BaseService<Orders> {
    constructor();
    findWithItems(id: number): Promise<Orders | null>;
}
declare const _default: SalesOrderService;
export default _default;
//# sourceMappingURL=sales_order.service.d.ts.map
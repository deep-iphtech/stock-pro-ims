import { Orders } from "../../models/Orders.js";
import { BaseService } from "../base/base.service.js";
export declare class OrderService extends BaseService<Orders> {
    constructor();
    findWithItems(id: number): Promise<Orders | null>;
    findByType(orderType: string, start?: number, length?: number, includeOrderItems?: boolean): Promise<{
        data: Orders[];
        recordsFiltered: number;
    }>;
    updateOrderInfo(id: number, data: any): Promise<Orders | null>;
}
declare const _default: OrderService;
export default _default;
//# sourceMappingURL=order.service.d.ts.map
import { OrderItems } from "../../models/OrderItems.js";
import { Orders } from "../../models/Orders.js";
import { BaseService } from "../base/base.service.js";
export declare class OrderService extends BaseService<Orders> {
    constructor();
    findWithItems(id: number): Promise<Orders | null>;
    findOtherItems(id: number): Promise<OrderItems[]>;
    findByType(orderType: string, start?: number, length?: number, includeOrderItems?: boolean, status?: string): Promise<{
        data: Orders[];
        recordsFiltered: number;
    }>;
    updateOrderInfo(id: number, data: any): Promise<Orders | null>;
}
declare const _default: OrderService;
export default _default;
//# sourceMappingURL=order.service.d.ts.map
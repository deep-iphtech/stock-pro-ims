import { Sequelize } from "sequelize";
import { OrderItems } from "../../models/OrderItems.js";
import { Orders } from "../../models/Orders.js";
import { BaseService } from "../base/base.service.js";
type AccountReceivableCustomer = {
    customer_id: number;
    total_amount_due: number;
    orders_1_5_days: number;
    orders_6_10_days: number;
    orders_11_14_days: number;
    orders_15_29_days: number;
    orders_30_plus_days: number;
};
type AccountReceivableResult = {
    grand_total_amount_due: number;
    data: AccountReceivableCustomer[];
};
export declare class OrderService extends BaseService<Orders> {
    constructor();
    findWithItems(id: number): Promise<Orders | null>;
    findOtherItems(id: number): Promise<OrderItems[]>;
    findByType(orderType: string, start?: number, length?: number, includeOrderItems?: boolean, status?: string, customerId?: number, search?: string, orderColumn?: string, orderDir?: "asc" | "desc"): Promise<{
        data: Orders[];
        recordsFiltered: number;
    }>;
    updateOrderInfo(id: number, data: any): Promise<Orders | null>;
    getAccountReceivable(sequelize: Sequelize): Promise<AccountReceivableResult>;
    getAccountPayable(sequelize: Sequelize): Promise<AccountReceivableResult>;
}
declare const _default: OrderService;
export default _default;

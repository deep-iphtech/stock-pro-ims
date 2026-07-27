import { Sequelize } from "sequelize";
import { OrderItems } from "../../models/OrderItems.js";
import { Orders } from "../../models/Orders.js";
import { BaseService } from "../base/base.service.js";
export declare class OrderService extends BaseService<Orders> {
    constructor();
    ordersReceivable(customerId: number): Promise<Orders[]>;
    ordersPayable(customerId: number): Promise<Orders[]>;
    findWithItems(id: number): Promise<Orders | null>;
    findOtherItems(id: number): Promise<OrderItems[]>;
    deleteOrderItems(ids: number[]): Promise<number>;
    fetchOpenPurchaseOrders(product_id: number, qty: number): Promise<Orders[]>;
    findByType(orderType: string, start?: number, length?: number, includeOrderItems?: boolean, status?: string, customerId?: number, search?: string, orderColumn?: string, orderDir?: "asc" | "desc"): Promise<{
        data: Orders[];
        recordsFiltered: number;
    }>;
    updateOrderInfo(id: number, data: any): Promise<Orders | null>;
    getAccountReceivable(sequelize: Sequelize, { draw, start, length, search, }: {
        draw: number;
        start: number;
        length: number;
        search?: string;
    }): Promise<{
        draw: number;
        recordsTotal: number;
        recordsFiltered: number;
        data: object[];
    }>;
    getAccountPayable(sequelize: Sequelize, { draw, start, length, search, }: {
        draw: number;
        start: number;
        length: number;
        search?: string;
    }): Promise<{
        draw: number;
        recordsTotal: number;
        recordsFiltered: number;
        grandTotalAmountDue: number;
        data: object[];
    }>;
}
declare const _default: OrderService;
export default _default;

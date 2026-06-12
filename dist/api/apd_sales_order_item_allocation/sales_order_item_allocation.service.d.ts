import { SalesOrderItemAllocation } from "../../models/SalesOrderItemAllocation.js";
import { BaseService } from "../base/base.service.js";
export declare class AllocationService extends BaseService<SalesOrderItemAllocation> {
    constructor();
    findByWarehouse(warehouseId: number): Promise<SalesOrderItemAllocation[]>;
    findByOrderItem(orderItemId: number): Promise<SalesOrderItemAllocation[]>;
}
declare const _default: AllocationService;
export default _default;
//# sourceMappingURL=sales_order_item_allocation.service.d.ts.map
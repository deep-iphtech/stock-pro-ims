import { SalesOrderItemAllocation } from "../../models/SalesOrderItemAllocation.js";
import { BaseService } from "../base/base.service.js";
export class AllocationService extends BaseService {
    constructor() {
        super(SalesOrderItemAllocation);
    }
    async findByWarehouse(warehouseId) {
        return SalesOrderItemAllocation.findAll({
            where: {
                warehouse_id: warehouseId,
            },
        });
    }
    async findByOrderItem(orderItemId) {
        return SalesOrderItemAllocation.findAll({
            where: {
                sales_order_item_id: orderItemId,
            },
        });
    }
}
export default new AllocationService();

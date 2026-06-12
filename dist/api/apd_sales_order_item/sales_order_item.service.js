import { SalesOrderItem } from "../../models/SalesOrderItem.js";
import { BaseService } from "../base/base.service.js";
export class SalesOrderItemService extends BaseService {
    constructor() {
        super(SalesOrderItem);
    }
    async findByOrder(orderId) {
        return SalesOrderItem.findAll({
            where: {
                sales_order_id: orderId,
            },
        });
    }
}
export default new SalesOrderItemService();

import { OrderItems } from "../../models/OrderItems.js";
import { BaseService } from "../base/base.service.js";
export class PurchaseOrderItemService extends BaseService {
    constructor() {
        super(OrderItems);
    }
    async findByOrder(orderId) {
        return OrderItems.findAll({
            where: {
                purchase_order_id: orderId,
            },
        });
    }
}
export default new PurchaseOrderItemService();

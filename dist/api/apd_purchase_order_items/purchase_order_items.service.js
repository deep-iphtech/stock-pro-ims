import { PurchaseOrderItem } from "../../models/PurchaseOrderItem.js";
import { BaseService } from "../base/base.service.js";
export class PurchaseOrderItemService extends BaseService {
    constructor() {
        super(PurchaseOrderItem);
    }
    async findByOrder(orderId) {
        return PurchaseOrderItem.findAll({
            where: {
                purchase_order_id: orderId,
            },
        });
    }
}
export default new PurchaseOrderItemService();

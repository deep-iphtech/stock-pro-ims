import { PurchaseOrder } from "../../models/PurchaseOrder.js";
import { BaseService } from "../base/base.service.js";
export class PurchaseOrderService extends BaseService {
    constructor() {
        super(PurchaseOrder);
    }
    async findWithItems(id) {
        return PurchaseOrder.findByPk(id, {
            include: ["items"],
        });
    }
}
export default new PurchaseOrderService();

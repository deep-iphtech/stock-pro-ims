import { SalesOrder } from "../../models/SalesOrder.js";
import { BaseService } from "../base/base.service.js";
export class SalesOrderService extends BaseService {
    constructor() {
        super(SalesOrder);
    }
    async findWithItems(id) {
        return SalesOrder.findByPk(id, {
            include: ["items"],
        });
    }
}
export default new SalesOrderService();

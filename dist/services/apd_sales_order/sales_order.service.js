import { Orders } from "../../models/Orders.js";
import { BaseService } from "../base/base.service.js";
export class SalesOrderService extends BaseService {
    constructor() {
        super(Orders);
    }
    async findWithItems(id) {
        return Orders.findByPk(id, {
            include: ["items"],
        });
    }
}
export default new SalesOrderService();

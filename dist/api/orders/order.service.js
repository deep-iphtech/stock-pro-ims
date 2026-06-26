import { Orders } from "../../models/Orders.js";
import { BaseService } from "../base/base.service.js";
export class OrderService extends BaseService {
    constructor() {
        super(Orders);
    }
    async findWithItems(id) {
        return Orders.findByPk(id, {
            include: ["items"],
        });
    }
    async findByType(orderType, start = 0, length = 10, includeOrderItems = false) {
        const { rows, count } = await Orders.findAndCountAll({
            where: {
                order_type: orderType,
            },
            include: includeOrderItems ? ["orderItems"] : [],
            offset: start,
            limit: length,
            order: [["id", "ASC"]],
        });
        return {
            data: rows,
            recordsFiltered: count,
        };
    }
}
export default new OrderService();

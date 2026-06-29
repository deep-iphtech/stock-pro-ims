import { OrderItems } from "../../models/OrderItems.js";
import { Orders } from "../../models/Orders.js";
import { BaseService } from "../base/base.service.js";
import { HttpError } from "../http.js";
export class OrderService extends BaseService {
    constructor() {
        super(Orders);
    }
    async findWithItems(id) {
        return Orders.findByPk(id, {
            include: ["orderItems"],
        });
    }
    async findOtherItems(id) {
        return OrderItems.findAll({
            where: { order_id: id },
            include: ["product"],
        });
    }
    async findByType(orderType, start = 0, length = 10, includeOrderItems = false, status) {
        const where = {
            order_type: orderType,
        };
        if (status) {
            where.status = status;
        }
        const { rows, count } = await Orders.findAndCountAll({
            where,
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
    async updateOrderInfo(id, data) {
        const [count] = await Orders.update(data, {
            where: { id },
        });
        if (!count) {
            throw new HttpError(404, "Order not found");
        }
        return Orders.findByPk(id);
    }
}
export default new OrderService();

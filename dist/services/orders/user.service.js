import { fn, literal, Op } from "sequelize";
import { Orders } from "../../models/Orders.js";
export class UserService {
    async userCredits(customerId) {
        return await Orders.findOne({
            attributes: [
                [
                    fn("SUM", literal(`CASE WHEN order_type = 'sales' THEN CAST(total_amount AS DECIMAL) ELSE 0 END`)),
                    "sales_expense",
                ],
                [
                    fn("SUM", literal(`CASE WHEN order_type = 'purchase' THEN CAST(total_amount AS DECIMAL) ELSE 0 END`)),
                    "purchase_expense",
                ],
            ],
            where: {
                customer_id: customerId,
                status: {
                    [Op.ne]: "0",
                },
                created_at: {
                    [Op.gte]: literal("date_trunc('month', CURRENT_DATE)"),
                    [Op.lt]: literal("date_trunc('month', CURRENT_DATE) + interval '1 month'"),
                },
            },
            raw: true,
        });
    }
}
export default new UserService();

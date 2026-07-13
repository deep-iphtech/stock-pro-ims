import { Op, QueryTypes } from "sequelize";
import { OrderItems } from "../../models/OrderItems.js";
import { Orders } from "../../models/Orders.js";
import { BaseService } from "../base/base.service.js";
import { HttpError } from "../http.js";
export class OrderService extends BaseService {
    constructor() {
        super(Orders);
    }
    // async findWithItems(id: number) {
    //   return Orders.findByPk(id, {
    //     include: ["orderItems"],
    //   });
    // }
    async findWithItems(id) {
        return Orders.findByPk(id, {
            include: ["orderItems"],
            // include: [
            //   {
            //     association: "orderItems",
            //     // include: [
            //     //   {
            //     //     association: "product",
            //     //   },
            //     // ],
            //   },
            //],
        });
    }
    async findOtherItems(id) {
        return OrderItems.findAll({
            where: { order_id: id },
            // include: ["product"],
        });
    }
    async deleteOrderItems(ids) {
        return await OrderItems.destroy({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            force: true,
        });
    }
    async updateOrderItems(orderItemInfo) { }
    async findByType(orderType, start = 0, length = 10, includeOrderItems = false, status, customerId, search, orderColumn = "id", orderDir = "asc") {
        const where = {
            order_type: orderType,
        };
        if (customerId) {
            where.customer_id = customerId;
        }
        if (status) {
            where.status = status;
        }
        if (search) {
            where[Op.or] = [
                {
                    order_number: {
                        [Op.like]: `%${search}%`,
                    },
                },
                {
                    status: {
                        [Op.like]: `%${search}%`,
                    },
                },
            ];
        }
        const { rows, count } = await Orders.findAndCountAll({
            where,
            include: includeOrderItems ? ["orderItems"] : [],
            distinct: true,
            col: "id",
            offset: start,
            limit: length,
            order: [[orderColumn, orderDir]],
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
    async getAccountReceivable(sequelize) {
        const query = `
     WITH order_totals AS (
    SELECT
        o.id AS order_id,
        o.customer_id,
        o.created_at,
        (
            COALESCE(SUM(oi.quantity * oi.price), 0)
            + COALESCE(o.shipping_charges, 0)
            - COALESCE(o.discount, 0)
        ) AS amount_due
    FROM ims_orders o
    LEFT JOIN ims_order_items oi
        ON oi.order_id = o.id
    WHERE o.payment_status <> 'paid'
      AND o.order_type = 'sales'
    GROUP BY
        o.id,
        o.customer_id,
        o.created_at,
        o.shipping_charges,
        o.discount
),
customer_totals AS (
    SELECT
        customer_id,
        ROUND(SUM(amount_due), 2) AS total_amount_due,
        COUNT(CASE WHEN CURRENT_DATE - created_at::date BETWEEN 0 AND 5 THEN 1 END) AS orders_1_5_days,
        COUNT(CASE WHEN CURRENT_DATE - created_at::date BETWEEN 6 AND 10 THEN 1 END) AS orders_6_10_days,
        COUNT(CASE WHEN CURRENT_DATE - created_at::date BETWEEN 11 AND 14 THEN 1 END) AS orders_11_14_days,
        COUNT(CASE WHEN CURRENT_DATE - created_at::date BETWEEN 15 AND 29 THEN 1 END) AS orders_15_29_days,
        COUNT(CASE WHEN CURRENT_DATE - created_at::date >= 30 THEN 1 END) AS orders_30_plus_days
    FROM order_totals
    GROUP BY customer_id
)
SELECT
    json_build_object(
        'grand_total_amount_due',
        COALESCE(SUM(total_amount_due), 0),

        'data',
        COALESCE(json_agg(customer_totals), '[]'::json)
    ) AS result
FROM customer_totals;
      `;
        const rows = await sequelize.query(query, {
            type: QueryTypes.SELECT,
        });
        const result = rows?.[0]?.result;
        return (result ?? {
            grand_total_amount_due: 0,
            data: [],
        });
    }
    async getAccountPayable(sequelize) {
        const query = `
   SELECT
  json_build_object(
    'grand_total_amount_due',
    COALESCE(SUM(amount_due), 0),

    'data',
    COALESCE(json_agg(customer_totals), '[]'::json)
  ) AS result
FROM (
  SELECT
    customer_id,
    ROUND(SUM(amount_due), 2) AS amount_due
  FROM (
    SELECT
      o.customer_id,
      (
        COALESCE((
          SELECT SUM(oi.quantity * oi.price)
          FROM ims_order_items oi
          WHERE oi.order_id = o.id
        ), 0)
        + COALESCE(o.shipping_charges, 0)
        - COALESCE(o.discount, 0)
      ) AS amount_due
    FROM ims_orders o
    WHERE o.payment_status <> 'paid'
      AND o.order_type = 'purchase'
  ) order_level
  GROUP BY customer_id
) customer_totals;
  `;
        const rows = await sequelize.query(query, {
            type: QueryTypes.SELECT,
        });
        const result = rows?.[0]?.result;
        return (result ?? {
            grand_total_amount_due: 0,
            data: [],
        });
    }
}
export default new OrderService();

import { Op, QueryTypes } from "sequelize";
import { OrderItems } from "../../models/OrderItems.js";
import { Orders } from "../../models/Orders.js";
import { BaseService } from "../base/base.service.js";
import { HttpError } from "../http.js";
export class OrderService extends BaseService {
    constructor() {
        super(Orders);
    }
    async ordersReceivable(customerId) {
        return await Orders.findAll({
            where: {
                order_type: "sales",
                payment_status: "0",
                customer_id: customerId,
            },
            include: [
                {
                    model: OrderItems,
                    as: "orderItems",
                    required: true,
                },
            ],
        });
    }
    async ordersPayable(customerId) {
        return await Orders.findAll({
            where: {
                order_type: "purchase",
                status: {
                    [Op.ne]: "7",
                },
                customer_id: customerId,
            },
            include: [
                {
                    model: OrderItems,
                    as: "orderItems",
                    required: true,
                },
            ],
        });
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
    async fetchOpenPurchaseOrders(product_id, qty) {
        return await Orders.findAll({
            where: {
                order_type: "purchase",
                status: "1",
            },
            include: [
                {
                    model: OrderItems,
                    as: "orderItems",
                    required: true,
                    where: {
                        product_id,
                        quantity: qty,
                    },
                },
            ],
        });
    }
    async findByType(orderType, start = 0, length = 10, includeOrderItems = false, status, customerId, search, orderColumn = "id", orderDir = "asc") {
        const where = {
            order_type: orderType,
        };
        if (customerId) {
            where.customer_id = customerId;
        }
        if (status) {
            where.status = Array.isArray(status) ? { [Op.in]: status } : status;
        }
        const ORDER_TYPES = ["sales", "purchase"];
        const statusMap = {
            cancelled: "0",
            created: "1",
            draft: "2",
            confirmed: "3",
            shipment: "4",
            ready: "5",
            shipped: "6",
            completed: "7",
        };
        const paymentMap = {
            pending: "0",
            paid: "1",
            partial: "2",
        };
        if (search) {
            const keyword = search.trim().toLowerCase();
            const filters = [
                {
                    order_number: {
                        [Op.like]: `%${keyword}%`,
                    },
                },
            ];
            if (ORDER_TYPES.includes(keyword)) {
                filters.push({ order_type: keyword });
            }
            if (statusMap[keyword]) {
                filters.push({ status: statusMap[keyword] });
            }
            if (paymentMap[keyword]) {
                filters.push({ payment_status: paymentMap[keyword] });
            }
            where[Op.or] = filters;
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
    async getAccountReceivable(sequelize, { draw, start = 0, length = 10, search = "", }) {
        const dataQuery = `
    WITH order_totals AS (
        SELECT
            o.id AS order_id,
            o.customer_id,
            o.created_at::date AS created_at,
            (
                COALESCE(SUM(oi.quantity * oi.price), 0)
                + COALESCE(o.shipping_charges, 0)
                - COALESCE(o.discount, 0)
            ) AS amount_due
        FROM ims_orders o
        LEFT JOIN ims_order_items oi
            ON oi.order_id = o.id
        WHERE
            o.payment_status <> '1'
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
            COUNT(*) FILTER (
                WHERE CURRENT_DATE - created_at BETWEEN 0 AND 5
            ) AS orders_1_5_days,
            COUNT(*) FILTER (
                WHERE CURRENT_DATE - created_at BETWEEN 6 AND 10
            ) AS orders_6_10_days,
            COUNT(*) FILTER (
                WHERE CURRENT_DATE - created_at BETWEEN 11 AND 14
            ) AS orders_11_14_days,
            COUNT(*) FILTER (
                WHERE CURRENT_DATE - created_at BETWEEN 15 AND 29
            ) AS orders_15_29_days,
            COUNT(*) FILTER (
                WHERE CURRENT_DATE - created_at >= 30
            ) AS orders_30_plus_days
        FROM order_totals
        GROUP BY customer_id
    )
    SELECT *
    FROM customer_totals
    WHERE CAST(customer_id AS TEXT) ILIKE :search
    ORDER BY customer_id
    LIMIT :length
    OFFSET :start;
  `;
        const summaryQuery = `
    WITH order_totals AS (
        SELECT
            o.id,
            o.customer_id,
            (
                COALESCE(SUM(oi.quantity * oi.price), 0)
                + COALESCE(o.shipping_charges, 0)
                - COALESCE(o.discount, 0)
            ) AS amount_due
        FROM ims_orders o
        LEFT JOIN ims_order_items oi
            ON oi.order_id = o.id
        WHERE
            o.payment_status <> '1'
            AND o.order_type = 'sales'
        GROUP BY
            o.id,
            o.customer_id,
            o.shipping_charges,
            o.discount
    )
    SELECT
        COUNT(DISTINCT customer_id)::int AS total,
        ROUND(COALESCE(SUM(amount_due), 0), 2) AS total_accounts_receivable
    FROM order_totals;
  `;
        const [data, [summary]] = await Promise.all([
            sequelize.query(dataQuery, {
                replacements: {
                    search: `%${search}%`,
                    start,
                    length,
                },
                type: QueryTypes.SELECT,
            }),
            sequelize.query(summaryQuery, {
                type: QueryTypes.SELECT,
            }),
        ]);
        return {
            draw,
            recordsTotal: Number(summary.total),
            recordsFiltered: Number(summary.total),
            totalAccountsReceivable: Number(summary.total_accounts_receivable),
            data,
        };
    }
    async getAccountPayable(sequelize, { draw, start = 0, length = 10, search = "", }) {
        const dataQuery = `
WITH order_totals AS (
    SELECT
        o.id,
        o.customer_id,
        (
            COALESCE(SUM(oi.quantity * oi.price), 0)
            + COALESCE(o.shipping_charges, 0)
            - COALESCE(o.discount, 0)
        ) AS amount_due
    FROM ims_orders o
    LEFT JOIN ims_order_items oi
        ON oi.order_id = o.id
    WHERE o.payment_status <> '1'
      AND o.order_type = 'purchase'
    GROUP BY
        o.id,
        o.customer_id,
        o.shipping_charges,
        o.discount
),
customer_totals AS (
    SELECT
        customer_id,
        ROUND(SUM(amount_due), 2) AS amount_due
    FROM order_totals
    GROUP BY customer_id
)
SELECT *
FROM customer_totals
WHERE CAST(customer_id AS TEXT) ILIKE :search
ORDER BY customer_id
LIMIT :length
OFFSET :start;
`;
        const countQuery = `
WITH order_totals AS (
    SELECT
        o.id,
        o.customer_id,
        (
            COALESCE(SUM(oi.quantity * oi.price), 0)
            + COALESCE(o.shipping_charges, 0)
            - COALESCE(o.discount, 0)
        ) AS amount_due
    FROM ims_orders o
    LEFT JOIN ims_order_items oi
        ON oi.order_id = o.id
    WHERE o.payment_status <> '1'
      AND o.order_type = 'purchase'
    GROUP BY
        o.id,
        o.customer_id,
        o.shipping_charges,
        o.discount
),
customer_totals AS (
    SELECT
        customer_id,
        ROUND(SUM(amount_due), 2) AS amount_due
    FROM order_totals
    GROUP BY customer_id
)
SELECT
    COUNT(*) AS total,
    COALESCE(SUM(amount_due), 0) AS grand_total_amount_due
FROM customer_totals
WHERE CAST(customer_id AS TEXT) ILIKE :search;
`;
        const data = await sequelize.query(dataQuery, {
            replacements: {
                search: `%${search}%`,
                length,
                start,
            },
            type: QueryTypes.SELECT,
        });
        const [countResult] = (await sequelize.query(countQuery, {
            replacements: {
                search: `%${search}%`,
            },
            type: QueryTypes.SELECT,
        }));
        return {
            draw,
            recordsTotal: Number(countResult.total),
            recordsFiltered: Number(countResult.total),
            grandTotalAmountDue: Number(countResult.grand_total_amount_due),
            data,
        };
    }
}
export default new OrderService();

import { createCrudRoutes } from "../services/http.js";
import OrderService from "../services/orders/order.service.js";
import { createPurchaseOrderWithItems } from "../controllers/order.controller.js";
import { Orders } from "../models/Orders.js";
import { orderIdSchema } from "../validations/common.schema.js";
import { createOrderValidationSchema, fetchOrderByTypeSchema, updateOrderInfoSchema, } from "../validations/order.schema.js";
export function buildOrderRoutes(defaultPath) {
    return [
        ...createCrudRoutes({
            prefix: defaultPath + "/orders",
            service: OrderService,
            createBody: (body) => createOrderValidationSchema.parse(body),
            createHandler: (payload, { db }) => createPurchaseOrderWithItems(db, payload),
            updateBody: (body) => updateOrderInfoSchema.parse(body),
        }),
        {
            method: "get",
            path: defaultPath + "/orders/:id/items",
            handler: ({ params }) => {
                const { id } = orderIdSchema.parse(params);
                return OrderService.findWithItems(id);
            },
        },
        {
            method: "get",
            path: defaultPath + "/orders/type/:order_type",
            handler: async ({ params, query }) => {
                const { order_type } = fetchOrderByTypeSchema.parse(params);
                const includeOrderItems = query.include === "orderItems";
                const status = query.status;
                const draw = Number(query.draw ?? 1);
                const start = Number(query.start ?? 0);
                const length = Number(query.length ?? 10);
                const totalRecords = await Orders.count();
                const result = await OrderService.findByType(order_type, start, length, includeOrderItems, status);
                return {
                    success: true,
                    draw,
                    recordsTotal: totalRecords,
                    recordsFiltered: result.recordsFiltered,
                    data: result.data,
                };
            },
        },
    ];
}

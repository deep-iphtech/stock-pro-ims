import { createCrudRoutes, getHeader, } from "../services/http.js";
import OrderService from "../services/orders/order.service.js";
import { createPurchaseOrderWithItems } from "../controllers/order.controller.js";
import { Orders } from "../models/Orders.js";
import { createOrderValidationSchema, fetchOrderByTypeSchema, updateOrderInfoSchema, } from "../validations/order.schema.js";
import { getTokenInfo } from "../utils/decodeJWT.js";
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
            path: defaultPath + "/orders/:id",
            handler: async ({ params }) => {
                const { id } = params;
                const data = await OrderService.findWithItems(Number(id));
                return {
                    success: true,
                    data,
                };
            },
        },
        {
            method: "get",
            path: defaultPath + "/orders/:id/items",
            handler: async ({ params }) => {
                const { id } = params;
                const data = await OrderService.findOtherItems(Number(id));
                return {
                    success: true,
                    data,
                };
            },
        },
        {
            method: "get",
            path: defaultPath + "/orders/type/:order_type",
            handler: async ({ params, query, request }) => {
                const { order_type } = fetchOrderByTypeSchema.parse(params);
                const includeOrderItems = query.include === "orderItems";
                const status = query.status;
                const draw = Number(query.draw ?? 1);
                const start = Number(query.start ?? 0);
                const length = Number(query.length ?? 10);
                const totalRecords = await Orders.count();
                const authHeader = getHeader(request, "authorization");
                let customerId;
                if (authHeader?.startsWith("Bearer ")) {
                    const token = authHeader.split(" ")[1];
                    const result = getTokenInfo(token);
                    if (!result.valid || !result.data) {
                        return {
                            success: false,
                            message: "Invalid token",
                        };
                    }
                    customerId = result.data.id;
                }
                const result = await OrderService.findByType(order_type, start, length, includeOrderItems, status, customerId);
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

import { createCrudRoutes, getHeader, } from "../services/http.js";
import OrderService from "../services/orders/order.service.js";
import { createPurchaseOrderWithItems } from "../controllers/order.controller.js";
import { Orders } from "../models/Orders.js";
import { createOrderValidationSchema, crudOnOrderItems, fetchOrderByTypeSchema, updateOrderInfoSchema, } from "../validations/order.schema.js";
import { getTokenInfo } from "../utils/decodeJWT.js";
import orderItemService from "../services/orders/orderItem.service.js";
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
            path: defaultPath + "/orders/account-receivable",
            handler: async ({ db }) => {
                const data = await OrderService.getAccountReceivable(db.sequelize);
                return {
                    success: true,
                    data,
                };
            },
        },
        {
            method: "get",
            path: defaultPath + "/orders/account-payable",
            handler: async ({ db }) => {
                const data = await OrderService.getAccountPayable(db.sequelize);
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
            method: "post",
            path: defaultPath + "/orders/update-items",
            handler: async ({ body, db }) => {
                const payload = crudOnOrderItems.parse(body);
                const { remove_items, update_items } = payload;
                let data = {};
                if (remove_items) {
                    data = await OrderService.deleteOrderItems(remove_items);
                }
                const transaction = await db.sequelize.transaction();
                if (update_items) {
                    try {
                        await Promise.all(update_items.map(async (item) => {
                            const { id, ...data } = item;
                            let updated = 1;
                            if (id) {
                                const [affectedRows] = await orderItemService.update(data, {
                                    where: { id },
                                    transaction,
                                });
                                updated = affectedRows;
                            }
                            else {
                                await orderItemService.create(data, transaction);
                            }
                            if (id && !updated) {
                                throw new Error(`Order item ${id} not found.`);
                            }
                        }));
                        await transaction.commit();
                        return {
                            success: true,
                            message: "Order items updated successfully.",
                        };
                    }
                    catch (err) {
                        await transaction.rollback();
                        return {
                            success: false,
                            message: err.message,
                        };
                    }
                }
                return {
                    success: true,
                    data,
                };
            },
        },
        {
            method: "get",
            path: defaultPath + "/orders/type/:order_type/:customer_id?",
            handler: async ({ params, query, request }) => {
                const { order_type } = fetchOrderByTypeSchema.parse(params);
                const includeOrderItems = query.include === "orderItems";
                const status = query.status;
                const draw = Number(query.draw ?? 1);
                const start = Number(query.start ?? 0);
                const length = Number(query.length ?? 10);
                const totalRecords = await Orders.count();
                const q = query;
                const search = q.search?.value ?? "";
                const orderColumnIndex = Number(q.order?.[0]?.column ?? 0);
                const orderDir = q.order?.[0]?.dir ?? "asc";
                const columns = ["id", "name", "email", "createdAt"];
                const orderColumn = columns[orderColumnIndex] ?? "id";
                const authHeader = getHeader(request, "authorization");
                let customerId = Number(query.customer_id);
                if (authHeader?.startsWith("Bearer ")) {
                    const token = authHeader.split(" ")[1];
                    const result = getTokenInfo(token);
                    if (!result.valid || !result.data) {
                        return {
                            success: false,
                            message: "Invalid token",
                        };
                    }
                    customerId = result.data?.customer_id;
                }
                const result = await OrderService.findByType(order_type, start, length, includeOrderItems, status, customerId, search, orderColumn, orderDir);
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

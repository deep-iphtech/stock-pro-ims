import { createCrudRoutes, getHeader, } from "../services/http.js";
import OrderService from "../services/orders/order.service.js";
import { createPurchaseOrderWithItems } from "../controllers/order.controller.js";
import { Orders } from "../models/Orders.js";
import { createOrderValidationSchema, crudOnOrderItems, fetchOpenPurchaseOrderSchema, fetchOrderByTypeSchema, updateOrderInfoSchema, } from "../validations/order.schema.js";
import { getTokenInfo } from "../utils/decodeJWT.js";
import orderItemService from "../services/orders/orderItem.service.js";
import { InventoryManagementService } from "../services/InventoryManagementService/im.service.js";
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
                    const ims = new InventoryManagementService(db.sequelize);
                    const orderItems = await orderItemService.findMultipleById(remove_items);
                    await Promise.all(orderItems.map(async (item) => {
                        const orderInfo = await OrderService.findById(item.order_id);
                        await ims.updateInventory(item.product_id, item.quantity_allocation, orderInfo?.order_type ?? "sales", "+");
                    }));
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
                            if (data.qty_allocation) {
                                const ims = new InventoryManagementService(db.sequelize);
                                await ims.reduceInventory(data.product_id, data.qty_allocation, transaction);
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
                const q = query;
                const search = query["search[value]"] ?? "";
                const orderColumnIndex = Number(query["order[0][column]"] ?? 0);
                const orderDir = query["order[0][dir]"] === "desc" ? "desc" : "asc";
                const columns = [
                    "id",
                    "order_type",
                    "customer_id",
                    "status",
                    "payment_status",
                ];
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
                const totalRecords = await Orders.count({
                    where: {
                        order_type,
                        ...(customerId ? { customer_id: customerId } : {}),
                        ...(status ? { status } : {}),
                    },
                });
                return {
                    success: true,
                    draw,
                    recordsTotal: totalRecords,
                    recordsFiltered: result.recordsFiltered,
                    data: result.data,
                };
            },
        },
        {
            method: "post",
            path: defaultPath + "/fetch-open-purchase-orders",
            handler: async ({ body, db }) => {
                try {
                    const { qty, product_id } = fetchOpenPurchaseOrderSchema.parse(body);
                    const data = await OrderService.fetchOpenPurchaseOrders(qty, product_id);
                    return { statusCode: 200, data };
                }
                catch (error) {
                    return error;
                }
                //
                // return {
                //   success: true,
                //   data,
                // };
            },
        },
    ];
}

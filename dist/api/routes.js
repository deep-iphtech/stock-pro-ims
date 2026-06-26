import { InventoryManagementService } from "./InventoryManagementService/im.service.js";
import inventoryService from "./apd_inventory/inventory.service.js";
import purchaseOrderItemService from "./apd_purchase_order_items/purchase_order_items.service.js";
import purchaseOrderService from "./apd_purchase_order/purchase_order.service.js";
import warehouseService from "./apd_warehouse/warehouse.service.js";
import { createCrudRoutes, } from "./http.js";
import { QueryService } from "./queries_fetch/queries.service.js";
import { ProductService } from "./products/product.service.js";
import * as z from "zod";
import { Orders } from "../models/Orders.js";
const WarehouseId = z.object({
    warehouseId: z.coerce.number().min(1),
});
const ProductId = z.object({
    productId: z.coerce.number().min(1),
});
const PurchaseId = z.object({
    id: z.coerce.number().min(1),
});
const OrderId = z.object({
    orderId: z.coerce.number().min(1),
});
const OrderItemId = z.object({
    orderItemId: z.coerce.number().min(1),
});
const PurchaseOrderId = z.object({
    purchaseOrderId: z.coerce.number().min(1),
});
const SalesOrderId = z.object({
    salesOrderId: z.coerce.number().min(1),
});
const SalesOrderItemId = z.object({
    salesOrderItemId: z.coerce.number().min(1),
});
const PurchaseOrderItemId = z.object({
    purchaseOrderItemId: z.coerce.number().min(1),
});
const BusinessId = z.object({
    businessId: z.coerce.number().min(0),
});
const SalesId = PurchaseId;
const Id = PurchaseId;
const ProductAndWarehouse = z.object({
    warehouseId: z.coerce.number().min(1),
    productId: z.coerce.number().min(1),
});
const AdjustStock = z.object({
    warehouseId: z.coerce.number().min(1),
    productId: z.coerce.number().min(1),
    quantity: z.coerce.number().min(0),
});
const StockTransfer = z.object({
    productId: z.coerce.number().min(1),
    sourceWarehouseId: z.coerce.number().min(1),
    targetWarehouseId: z.coerce.number().min(1),
    quantity: z.coerce.number().min(1),
});
const PurchaseOrderWithProductId = z.object({
    businessId: z.coerce.number().min(1).optional(),
    createdBy: z.coerce.number().min(1).optional(),
});
const integer = z.number().int();
const positiveInteger = integer.min(1);
function updateSchema(shape) {
    return z
        .object(shape)
        .partial()
        .strict()
        .refine((value) => Object.keys(value).length > 0, {
        message: "At least one field must be provided",
    });
}
const WarehouseCreateBody = z
    .object({
    name: z.string(),
})
    .strict();
const WarehouseUpdateBody = updateSchema({
    name: z.string(),
});
const InventoryCreateBody = z
    .object({
    product_id: positiveInteger,
    warehouse_id: positiveInteger.nullable().optional(),
    available: integer.optional(),
    reserved: integer.optional(),
})
    .strict();
const InventoryUpdateBody = updateSchema({
    product_id: positiveInteger,
    warehouse_id: positiveInteger.nullable().optional(),
    available: integer,
    reserved: integer,
});
const PurchaseOrderCreateItemBody = z
    .object({
    product_id: positiveInteger,
    quantity: integer,
    price: z.number().default(0),
    warehouse_id: positiveInteger.nullable().optional(),
    quantity_allocation: z
        .string()
        .refine((value) => value.split(",").every((item) => /^\d+:\d+$/.test(item)), {
        message: "Invalid format. Expected id:count,id:count",
    }),
})
    .loose();
const createOrderValidationSchema = z
    .object({
    order_type: z.enum(["sales", "purchase"]),
    customer_id: positiveInteger,
    status: z
        .enum(["draft", "pending", "approved", "received", "cancelled"])
        .optional(),
    products: z.array(PurchaseOrderCreateItemBody).min(1),
})
    .loose();
function createPurchaseOrderWithItems(db, payload) {
    const { products, ...orderInfo } = payload;
    return db.sequelize.transaction(async (transaction) => {
        const order = await Orders.create({
            order_number: "ORD-" +
                orderInfo.order_type.toUpperCase() +
                "-" +
                Date.now() +
                orderInfo.customer_id,
            ...orderInfo,
        }, { transaction });
        await db.OrderItems.bulkCreate(products.map((item) => ({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            warehouse_id: item.warehouse_id,
        })), { transaction });
        return { order_id: order.id, order_number: order.order_number };
    });
}
const PurchaseOrderUpdateBody = updateSchema({
    order_number: z.string().optional(),
    business_id: positiveInteger,
    status: z
        .enum(["draft", "pending", "approved", "received", "cancelled"])
        .optional(),
    shipping_charges: z.number().optional(),
    notes: z.string().nullable().optional(),
    created_by: positiveInteger,
    payment_status: z.enum(["pending", "partial", "paid"]).optional(),
    paid_at: z.string().nullable().optional(),
}).strict();
const PurchaseOrderItemCreateBody = z
    .object({
    purchase_order_id: positiveInteger,
    product_id: positiveInteger,
    quantity: integer,
    pricing_tier: z.enum([
        "retail",
        "wholesale",
        "distributor",
        "t1",
        "t2",
        "t3",
    ]),
    price: z.number(),
    warehouse_id: positiveInteger.nullable().optional(),
})
    .strict();
const PurchaseOrderItemUpdateBody = updateSchema({
    purchase_order_id: positiveInteger,
    product_id: positiveInteger,
    quantity: integer,
    pricing_tier: z.enum([
        "retail",
        "wholesale",
        "distributor",
        "t1",
        "t2",
        "t3",
    ]),
    price: z.number(),
    warehouse_id: positiveInteger.nullable().optional(),
});
const SalesOrderCreateBody = z
    .object({
    order_number: z.string().optional(),
    business_id: positiveInteger.nullable().optional(),
    status: z
        .enum([
        "draft",
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "completed",
        "cancelled",
    ])
        .optional(),
    invoice_date: z.string(),
    shipping_charges: z.number().optional(),
    notes: z.string().nullable().optional(),
    created_by: positiveInteger,
    payment_status: z.enum(["pending", "partial", "paid"]).optional(),
    paid_at: z.string().nullable().optional(),
    drop_ship_contact: z.string().nullable().optional(),
    shipping_address: z.string().nullable().optional(),
})
    .strict();
const SalesOrderUpdateBody = updateSchema({
    order_number: z.string().optional(),
    business_id: positiveInteger.nullable(),
    status: z.enum([
        "draft",
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "completed",
        "cancelled",
    ]),
    invoice_date: z.string(),
    shipping_charges: z.number(),
    notes: z.string().nullable(),
    created_by: positiveInteger,
    payment_status: z.enum(["pending", "partial", "paid"]),
    paid_at: z.string().nullable(),
    drop_ship_contact: z.string().nullable(),
    shipping_address: z.string().nullable(),
});
const SalesOrderItemCreateBody = z
    .object({
    sales_order_id: positiveInteger,
    product_id: positiveInteger,
    quantity: integer,
    pricing_tier: z.enum([
        "retail",
        "wholesale",
        "distributor",
        "t1",
        "t2",
        "t3",
    ]),
    price: z.number(),
})
    .strict();
const SalesOrderItemUpdateBody = updateSchema({
    sales_order_id: positiveInteger,
    product_id: positiveInteger,
    quantity: integer,
    pricing_tier: z.enum([
        "retail",
        "wholesale",
        "distributor",
        "t1",
        "t2",
        "t3",
    ]),
    price: z.number(),
});
const SalesOrderItemAllocationCreateBody = z
    .object({
    sales_order_item_id: positiveInteger,
    warehouse_id: positiveInteger.nullable().optional(),
    quantity: integer,
})
    .strict();
const SalesOrderItemAllocationUpdateBody = updateSchema({
    sales_order_item_id: positiveInteger,
    warehouse_id: positiveInteger.nullable().optional(),
    quantity: integer,
});
function buildInventoryRoutes(defaultPath) {
    return [
        ...createCrudRoutes({
            prefix: defaultPath + "/inventories",
            service: inventoryService,
            createBody: (body) => InventoryCreateBody.parse(body),
            updateBody: (body) => InventoryUpdateBody.parse(body),
        }),
        {
            method: "get",
            path: defaultPath + "/inventories/warehouse/:warehouseId",
            handler: ({ params }) => {
                const { warehouseId } = WarehouseId.parse(params);
                return inventoryService.findByWarehouse(warehouseId);
            },
        },
        {
            method: "get",
            path: defaultPath + "/inventories/product/:productId",
            handler: ({ params }) => {
                const { productId } = ProductId.parse(params);
                return inventoryService.findByProduct(productId);
            },
        },
        {
            method: "get",
            path: defaultPath + "/inventories/product/:productId/warehouse/:warehouseId",
            handler: ({ params }) => {
                const { productId, warehouseId } = ProductAndWarehouse.parse(params);
                return inventoryService.findByProductAndWarehouse(productId, warehouseId);
            },
        },
        {
            method: "post",
            path: defaultPath + "/inventories/adjust-stock",
            handler: ({ body }) => {
                const payload = AdjustStock.parse(body);
                return inventoryService.adjustStock(payload.productId, payload.warehouseId, Number(payload.quantity));
            },
        },
    ];
}
function buildWarehouseRoutes(defaultPath) {
    return createCrudRoutes({
        prefix: defaultPath + "/warehouses",
        service: warehouseService,
        createBody: (body) => WarehouseCreateBody.parse(body),
        updateBody: (body) => WarehouseUpdateBody.parse(body),
    });
}
function buildPurchaseOrderRoutes(defaultPath) {
    return [
        ...createCrudRoutes({
            prefix: defaultPath + "/orders",
            service: purchaseOrderService,
            createBody: (body) => createOrderValidationSchema.parse(body),
            createHandler: (payload, { db }) => createPurchaseOrderWithItems(db, payload),
            updateBody: (body) => PurchaseOrderUpdateBody.parse(body),
        }),
        {
            method: "get",
            path: defaultPath + "/orders/:id/items",
            handler: ({ params }) => {
                const { id } = PurchaseId.parse(params);
                return purchaseOrderService.findWithItems(id);
            },
        },
    ];
}
function buildPurchaseOrderItemRoutes(defaultPath) {
    return [
        ...createCrudRoutes({
            prefix: defaultPath + "/purchase-order-items",
            service: purchaseOrderItemService,
            createBody: (body) => PurchaseOrderItemCreateBody.parse(body),
            updateBody: (body) => PurchaseOrderItemUpdateBody.parse(body),
        }),
        {
            method: "get",
            path: defaultPath + "/purchase-order-items/by-order/:orderId",
            handler: ({ params }) => {
                const { orderId } = OrderId.parse(params);
                return purchaseOrderItemService.findByOrder(orderId);
            },
        },
    ];
}
function buildInventoryManagementRoutes(db, defaultPath) {
    const service = new InventoryManagementService(db.sequelize);
    return [
        {
            method: "post",
            path: defaultPath +
                "/inventory-management/purchase-orders/:purchaseOrderId/receive",
            handler: ({ params }) => {
                const { purchaseOrderId } = PurchaseOrderId.parse(params);
                return service.receivePurchaseOrder(purchaseOrderId);
            },
        },
        {
            method: "post",
            path: defaultPath +
                "/inventory-management/sales-orders/:salesOrderId/allocate",
            handler: ({ params }) => {
                const { salesOrderId } = SalesOrderId.parse(params);
                return service.allocateSalesOrder(salesOrderId);
            },
        },
        {
            method: "post",
            path: defaultPath + "/inventory-management/sales-orders/:salesOrderId/ship",
            handler: ({ params }) => {
                const { salesOrderId } = SalesOrderId.parse(params);
                return service.shipSalesOrder(salesOrderId);
            },
        },
        {
            method: "post",
            path: defaultPath + "/inventory-management/sales-orders/:salesOrderId/cancel",
            handler: ({ params }) => {
                const { salesOrderId } = SalesOrderId.parse(params);
                return service.cancelSalesOrder(salesOrderId);
            },
        },
        {
            method: "post",
            path: defaultPath + "/inventory-management/stock/transfer",
            handler: ({ body }) => {
                const { productId, sourceWarehouseId, targetWarehouseId, quantity } = StockTransfer.parse(body);
                return service.transferStock(productId, sourceWarehouseId, targetWarehouseId, quantity);
            },
        },
    ];
}
function buildQueryRoutes(db, defaultPath) {
    const service = new QueryService(db);
    return [
        {
            method: "get",
            path: defaultPath + "/query/sales-order-items/:salesOrderItemId/products",
            handler: ({ params }) => {
                const { salesOrderItemId } = SalesOrderItemId.parse(params);
                return service.fetchSalesOrderItemWithProducts(salesOrderItemId);
            },
        },
        {
            method: "get",
            path: defaultPath + "/query/sales-orders/by-business/:businessId/products",
            handler: ({ params }) => {
                const { businessId } = BusinessId.parse(params);
                return service.fetchSalesOrdersWithProducts(businessId);
            },
        },
        {
            method: "get",
            path: defaultPath + "/query/sales-orders/:salesOrderId/products",
            handler: ({ params }) => {
                const { salesOrderId } = SalesOrderId.parse(params);
                return service.fetchSalesOrderWithProducts(salesOrderId);
            },
        },
        {
            method: "get",
            path: defaultPath +
                "/query/purchase-order-items/:purchaseOrderItemId/products",
            handler: ({ params }) => {
                const { purchaseOrderItemId } = PurchaseOrderItemId.parse(params);
                return service.fetchPurchaseOrderItemWithProducts(purchaseOrderItemId);
            },
        },
        {
            method: "post",
            path: defaultPath + "/query/purchase-orders/products",
            handler: ({ body }) => {
                return service.fetchPurchaseOrdersWithProducts(PurchaseOrderWithProductId.parse(body));
            },
        },
        {
            method: "get",
            path: defaultPath + "/query/purchase-orders/:purchaseOrderId/products",
            handler: ({ params }) => {
                return service.fetchPurchaseOrderWithProducts(PurchaseOrderId.parse(params).purchaseOrderId);
            },
        },
        {
            method: "get",
            path: defaultPath + "/quey/inventory/:productId/products",
            handler: ({ params }) => {
                return service.fetchInventoryWithProducts(ProductId.parse(params).productId);
            },
        },
    ];
}
function buildProductsRoutes(db, defaultPath) {
    const service = new ProductService(db);
    return [
        {
            method: "get",
            path: defaultPath + "/products",
            handler: () => {
                return service.findAll();
            },
        },
        {
            method: "post",
            path: defaultPath + "/products",
            handler: (request) => {
                return service.create(request.body);
            },
        },
        {
            method: "get",
            path: defaultPath + "/products/:id",
            handler: (request) => {
                return service.findById(Id.parse(request.params).id);
            },
        },
        {
            method: "put",
            path: defaultPath + "/products/:id",
            handler: (request) => {
                return service.update(Id.parse(request.params).id, request.body);
            },
        },
        {
            method: "delete",
            path: defaultPath + "/products/:id",
            handler: (request) => {
                return service.delete(Id.parse(request.params).id);
            },
        },
    ];
}
function buildTestProtectedRoutes(defaultPath) {
    return [
        {
            method: "get",
            path: defaultPath + "/protected",
            protected: true,
            handler: () => {
                return {
                    message: "Protected Routes - accessed",
                };
            },
        },
    ];
}
export function buildAutoPoolRoutes(db, defaultPath) {
    return [
        ...buildWarehouseRoutes(defaultPath),
        ...buildInventoryRoutes(defaultPath),
        ...buildPurchaseOrderRoutes(defaultPath),
        ...buildPurchaseOrderItemRoutes(defaultPath),
        ...buildInventoryManagementRoutes(db, defaultPath),
        ...buildQueryRoutes(db, defaultPath),
        ...buildProductsRoutes(db, defaultPath),
        ...buildTestProtectedRoutes(defaultPath),
    ];
}

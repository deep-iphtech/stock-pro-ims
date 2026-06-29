import { InventoryManagementService } from "./InventoryManagementService/im.service.js";
import { ProductService } from "./products/product.service.js";
import * as z from "zod";
const PurchaseId = z.object({
    id: z.coerce.number().min(1),
});
const PurchaseOrderId = z.object({
    purchaseOrderId: z.coerce.number().min(1),
});
const SalesOrderId = z.object({
    salesOrderId: z.coerce.number().min(1),
});
const Id = PurchaseId;
const StockTransfer = z.object({
    productId: z.coerce.number().min(1),
    sourceWarehouseId: z.coerce.number().min(1),
    targetWarehouseId: z.coerce.number().min(1),
    quantity: z.coerce.number().min(1),
});
function updateSchema(shape) {
    return z
        .object(shape)
        .partial()
        .strict()
        .refine((value) => Object.keys(value).length > 0, {
        message: "At least one field must be provided",
    });
}
// function buildPurchaseOrderItemRoutes(defaultPath: string): RouteDefinition[] {
//   return [
//     ...createCrudRoutes({
//       prefix: defaultPath + "/purchase-order-items",
//       service: purchaseOrderItemService,
//       createBody: (body) => PurchaseOrderItemCreateBody.parse(body),
//       updateBody: (body) => PurchaseOrderItemUpdateBody.parse(body),
//     }),
//     {
//       method: "get",
//       path: defaultPath + "/purchase-order-items/by-order/:orderId",
//       handler: ({ params }) => {
//         const { orderId } = OrderId.parse(params);
//         return purchaseOrderItemService.findByOrder(orderId);
//       },
//     },
//   ];
// }
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

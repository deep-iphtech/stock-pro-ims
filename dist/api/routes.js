import { InventoryManagementService } from "./InventoryManagementService/im.service.js";
import inventoryService from "./apd_inventory/inventory.service.js";
import purchaseOrderItemService from "./apd_purchase_order_items/purchase_order_items.service.js";
import purchaseOrderService from "./apd_purchase_order/purchase_order.service.js";
import salesOrderItemAllocationService from "./apd_sales_order_item_allocation/sales_order_item_allocation.service.js";
import salesOrderItemService from "./apd_sales_order_item/sales_order_item.service.js";
import salesOrderService from "./apd_sales_order/sales_order.service.js";
import warehouseService from "./apd_warehouse/warehouse.service.js";
import { createCrudRoutes, } from "./http.js";
import { QueryService } from "./queries_fetch/queries.service.js";
import { ProductService } from "./products/product.service.js";
import * as z from "zod";
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
function buildInventoryRoutes(defaultPath) {
    return [
        ...createCrudRoutes({
            prefix: defaultPath + "/inventories",
            service: inventoryService,
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
    });
}
function buildPurchaseOrderRoutes(defaultPath) {
    return [
        ...createCrudRoutes({
            prefix: defaultPath + "/purchase-orders",
            service: purchaseOrderService,
        }),
        {
            method: "get",
            path: defaultPath + "/purchase-orders/:id/items",
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
function buildSalesOrderRoutes(defaultPath) {
    return [
        ...createCrudRoutes({
            prefix: defaultPath + "/sales-orders",
            service: salesOrderService,
        }),
        {
            method: "get",
            path: defaultPath + "/sales-orders/:id/items",
            handler: ({ params }) => {
                const { id } = SalesId.parse(params);
                return salesOrderService.findWithItems(id);
            },
        },
    ];
}
function buildSalesOrderItemRoutes(defaultPath) {
    return [
        ...createCrudRoutes({
            prefix: defaultPath + "/sales-order-items",
            service: salesOrderItemService,
        }),
        {
            method: "get",
            path: defaultPath + "/sales-order-items/by-order/:orderId",
            handler: ({ params }) => {
                const { orderId } = OrderId.parse(params);
                return salesOrderItemService.findByOrder(orderId);
            },
        },
    ];
}
function buildSalesOrderItemAllocationRoutes(defaultPath) {
    return [
        ...createCrudRoutes({
            prefix: defaultPath + "/sales-order-item-allocations",
            service: salesOrderItemAllocationService,
        }),
        {
            method: "get",
            path: defaultPath + "/sales-order-item-allocations/by-warehouse/:warehouseId",
            handler: ({ params }) => {
                const { warehouseId } = WarehouseId.parse(params);
                return salesOrderItemAllocationService.findByWarehouse(warehouseId);
            },
        },
        {
            method: "get",
            path: defaultPath +
                "/sales-order-item-allocations/by-order-item/:orderItemId",
            handler: ({ params }) => {
                const { orderItemId } = OrderItemId.parse(params);
                return salesOrderItemAllocationService.findByOrderItem(orderItemId);
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
        ...buildSalesOrderRoutes(defaultPath),
        ...buildSalesOrderItemRoutes(defaultPath),
        ...buildSalesOrderItemAllocationRoutes(defaultPath),
        ...buildInventoryManagementRoutes(db, defaultPath),
        ...buildQueryRoutes(db, defaultPath),
        ...buildProductsRoutes(db, defaultPath),
        ...buildTestProtectedRoutes(defaultPath)
    ];
}

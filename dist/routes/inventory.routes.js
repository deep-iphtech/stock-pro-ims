import InventoryService from "../services/apd_inventory/inventory.service.js";
import { createCrudRoutes } from "../services/http.js";
import { productAndWarehouseSchema, productIdSchema, warehouseIdSchema, } from "../validations/common.schema.js";
import { adjustStockSchema, inventoryCuSchema, } from "../validations/inventory.schema.js";
export function buildInventoryRoutes(defaultPath) {
    return [
        ...createCrudRoutes({
            prefix: defaultPath + "/inventories",
            service: InventoryService,
            createBody: (body) => inventoryCuSchema.parse(body),
            updateBody: (body) => inventoryCuSchema.parse(body),
        }),
        {
            method: "get",
            path: defaultPath + "/product-inventory",
            handler: async ({ params }) => {
                const data = await InventoryService.getAllProductsInventory();
                return {
                    success: true,
                    data,
                };
            },
        },
        {
            method: "get",
            path: defaultPath + "/warehouse/:warehouseId",
            handler: ({ params }) => {
                const { warehouseId } = warehouseIdSchema.parse(params);
                return InventoryService.findByWarehouse(warehouseId);
            },
        },
        {
            method: "get",
            path: defaultPath + "/inventories/warehouse/:warehouseId",
            handler: ({ params }) => {
                const { warehouseId } = warehouseIdSchema.parse(params);
                return InventoryService.findByWarehouse(warehouseId);
            },
        },
        {
            method: "get",
            path: defaultPath + "/inventories/product/:productId",
            handler: ({ params }) => {
                const { productId } = productIdSchema.parse(params);
                return InventoryService.findByProduct(productId);
            },
        },
        {
            method: "get",
            path: defaultPath + "/inventories/product/:productId/warehouse/:warehouseId",
            handler: ({ params }) => {
                const { productId, warehouseId } = productAndWarehouseSchema.parse(params);
                return InventoryService.findByProductAndWarehouse(productId, warehouseId);
            },
        },
        {
            method: "post",
            path: defaultPath + "/inventories/adjust-stock",
            handler: ({ body }) => {
                const payload = adjustStockSchema.parse(body);
                return InventoryService.adjustStock(payload.productId, payload.warehouseId, Number(payload.quantity));
            },
        },
    ];
}

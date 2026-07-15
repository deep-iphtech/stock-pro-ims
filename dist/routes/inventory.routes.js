import { Inventory } from "../models/Inventory.js";
import InventoryService from "../services/apd_inventory/inventory.service.js";
import { productAndWarehouseSchema, productIdSchema, warehouseIdSchema, } from "../validations/common.schema.js";
import { adjustStockSchema, inventoryCuSchema, } from "../validations/inventory.schema.js";
export function buildInventoryRoutes(defaultPath) {
    return [
        {
            method: "get",
            path: defaultPath + "/fetch-inventory",
            handler: async ({}) => {
                const data = await InventoryService.findAll();
                return {
                    success: true,
                    data,
                };
            },
        },
        {
            method: "post",
            path: defaultPath + "/create-inventory",
            handler: async ({ body }) => {
                const payload = inventoryCuSchema.parse(body);
                const { warehouse_id, product_id, available_qty } = payload;
                const [inventory, created] = await Inventory.findOrCreate({
                    where: {
                        warehouse_id: warehouse_id,
                        product_id,
                    },
                    defaults: {
                        warehouse_id: warehouse_id,
                        product_id,
                        available_qty: available_qty,
                    },
                });
                if (!created) {
                    await inventory.increment("available_qty", {
                        by: available_qty,
                    });
                }
                return {
                    success: true,
                    message: created
                        ? "Product added in Warehouse"
                        : `Product qty increased in warehouse ${warehouse_id}`,
                };
            },
        },
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

import { Inventory } from "../models/Inventory.js";
import InventoryService from "../services/apd_inventory/inventory.service.js";
import { productAndWarehouseSchema, productIdSchema, warehouseIdSchema, } from "../validations/common.schema.js";
import { adjustStockSchema } from "../validations/inventory.schema.js";
export function buildInventoryRoutes(defaultPath) {
    return [
        {
            method: "get",
            path: defaultPath + "/fetch-inventory",
            handler: async ({ query }) => {
                const data = await InventoryService.findAll();
                return {
                    success: true,
                    data,
                };
            },
        },
        {
            method: "post",
            path: defaultPath + "/adjust-inventory",
            handler: async ({ body }) => {
                const payload = adjustStockSchema.parse(body);
                const { product_id, inv } = payload;
                const results = [];
                for (const { warehouse_id, available_qty } of inv) {
                    const [inventory, created] = await Inventory.findOrCreate({
                        where: {
                            warehouse_id,
                            product_id,
                        },
                        defaults: {
                            warehouse_id,
                            product_id,
                            available_qty,
                        },
                    });
                    if (!created) {
                        // await inventory.increment("available_qty", {
                        //   by: available_qty,
                        // });
                        inventory.available_qty += available_qty;
                        await inventory.save();
                    }
                    let message;
                    if (created) {
                        message = "Product added in Warehouse";
                    }
                    else if (available_qty > 0) {
                        message = `Product quantity increased in warehouse ${warehouse_id}`;
                    }
                    else if (available_qty < 0) {
                        message = `Product quantity decreased in warehouse ${warehouse_id}`;
                    }
                    else {
                        message = `Product quantity unchanged in warehouse ${warehouse_id}`;
                    }
                    results.push({
                        warehouse_id,
                        success: true,
                        message,
                    });
                }
                return {
                    results,
                };
            },
        },
        {
            method: "get",
            path: defaultPath + "/product-inventory",
            handler: async ({ query }) => {
                const data = await InventoryService.getAllProductsInventory(query);
                return data;
            },
        },
        {
            method: "post",
            path: defaultPath + "/inventory-by-product",
            handler: async ({ body }) => {
                const { product_id } = productIdSchema.parse(body);
                const data = await InventoryService.inventoryByProduct(product_id);
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
            path: defaultPath + "/inventories/product/:productId/warehouse/:warehouseId",
            handler: ({ params }) => {
                const { productId, warehouseId } = productAndWarehouseSchema.parse(params);
                return InventoryService.findByProductAndWarehouse(productId, warehouseId);
            },
        },
        // {
        //   method: "post",
        //   path: defaultPath + "/inventories/adjust-stock",
        //   handler: ({ body }) => {
        //     const payload = adjustStockSchema.parse(body);
        //     return InventoryService.adjustStock(
        //       payload.productId,
        //       payload.warehouseId,
        //       Number(payload.quantity),
        //     );
        //   },
        // },
    ];
}

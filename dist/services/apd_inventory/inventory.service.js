import { Inventory } from "../../models/Inventory.js";
import { BaseService } from "../base/base.service.js";
import { fn, col, literal } from "sequelize";
export class InventoryService extends BaseService {
    constructor() {
        super(Inventory);
    }
    async getAllProductsInventory() {
        return Inventory.findAll({
            attributes: [
                "product_id",
                [fn("SUM", col("Inventory.available")), "total_available"],
                [fn("SUM", col("Inventory.reserved")), "total_reserved"],
                [
                    literal(`
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'warehouse_id', "Inventory"."warehouse_id",
              'available', "Inventory"."available",
              'reserved', "Inventory"."reserved"
            )
            ORDER BY "Inventory"."warehouse_id"
          )
        `),
                    "warehouses",
                ],
                [
                    literal(`
          (
            SELECT COALESCE(
              JSONB_OBJECT_AGG(t.order_type, t.total_quantity),
              '{}'::jsonb
            )
            FROM (
              SELECT
                o.order_type,
                SUM(oi.quantity) AS total_quantity
              FROM ims_order_items oi
              JOIN ims_orders o
                ON o.id = oi.order_id
              WHERE oi.product_id = "Inventory"."product_id"
              GROUP BY o.order_type
            ) t
          )
        `),
                    "order_types",
                ],
            ],
            group: ["Inventory.product_id"],
            raw: true,
        });
    }
    async findByWarehouse(warehouseId) {
        return Inventory.findAll({
            where: {
                warehouse_id: warehouseId,
            },
        });
    }
    async findByProduct(productId) {
        return Inventory.findAll({
            where: {
                product_id: productId,
            },
        });
    }
    async findByProductAndWarehouse(productId, warehouseId) {
        return Inventory.findOne({
            where: {
                product_id: productId,
                warehouse_id: warehouseId,
            },
        });
    }
    async adjustStock(productId, warehouseId, quantity) {
        const inventory = await this.findByProductAndWarehouse(productId, warehouseId);
        if (!inventory) {
            throw new Error("Inventory not found");
        }
        inventory.available_qty += quantity;
        await inventory.save();
        return inventory;
    }
}
export default new InventoryService();

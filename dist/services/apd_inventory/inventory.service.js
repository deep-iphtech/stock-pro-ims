import { Inventory } from "../../models/Inventory.js";
import { BaseService } from "../base/base.service.js";
export class InventoryService extends BaseService {
    constructor() {
        super(Inventory);
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
        inventory.available += quantity;
        await inventory.save();
        return inventory;
    }
}
export default new InventoryService();

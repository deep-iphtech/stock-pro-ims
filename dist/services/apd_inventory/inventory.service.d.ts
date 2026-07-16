import { Inventory } from "../../models/Inventory.js";
import { BaseService } from "../base/base.service.js";
export declare class InventoryService extends BaseService<Inventory> {
    constructor();
    getAllProductsInventory(query: Record<string, unknown>): Promise<{
        draw: number;
        recordsTotal: number;
        recordsFiltered: number;
        data: Inventory[];
    }>;
    findByWarehouse(warehouseId: number): Promise<Inventory[]>;
    findByProduct(productId: number): Promise<Inventory[]>;
    findByProductAndWarehouse(productId: number, warehouseId: number): Promise<Inventory | null>;
    adjustStock(productId: number, warehouseId: number, quantity: number): Promise<Inventory>;
}
declare const _default: InventoryService;
export default _default;

import type { Sequelize } from "@sequelize/core";
export declare class InventoryManagementController {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    private get service();
    receivePurchaseOrder(purchaseOrderId: number): Promise<any>;
    allocateSalesOrder(salesOrderId: number): Promise<any>;
    shipSalesOrder(salesOrderId: number): Promise<any>;
    cancelSalesOrder(salesOrderId: number): Promise<any>;
    transferStock(productId: number, sourceWarehouseId: number, targetWarehouseId: number, quantity: number): Promise<{
        source: import("../../index.js").Inventory;
        target: import("../../index.js").Inventory;
    }>;
}
//# sourceMappingURL=im.controller.d.ts.map
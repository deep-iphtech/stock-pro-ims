import { Inventory } from "../../models/Inventory.js";
import { Sequelize } from "sequelize";
export declare class InventoryManagementService {
    private sequelize;
    constructor(sequelize: Sequelize);
    private receivePurchaseOrderInternal;
    private allocateSalesOrderInternal;
    private shipSalesOrderInternal;
    private cancelSalesOrderInternal;
    private transferStockInternal;
    receivePurchaseOrder(purchaseOrderId: number): Promise<any>;
    allocateSalesOrder(salesOrderId: number): Promise<any>;
    shipSalesOrder(salesOrderId: number): Promise<any>;
    cancelSalesOrder(salesOrderId: number): Promise<any>;
    transferStock(productId: number, sourceWarehouseId: number, targetWarehouseId: number, quantity: number): Promise<{
        source: Inventory;
        target: Inventory;
    }>;
}
//# sourceMappingURL=im.service.d.ts.map
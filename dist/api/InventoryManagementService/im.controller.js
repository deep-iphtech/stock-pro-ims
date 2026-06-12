import { InventoryManagementService } from "./im.service.js";
export class InventoryManagementController {
    sequelize;
    constructor(sequelize) {
        this.sequelize = sequelize;
    }
    get service() {
        return new InventoryManagementService(this.sequelize);
    }
    async receivePurchaseOrder(purchaseOrderId) {
        return this.service.receivePurchaseOrder(purchaseOrderId);
    }
    async allocateSalesOrder(salesOrderId) {
        return this.service.allocateSalesOrder(salesOrderId);
    }
    async shipSalesOrder(salesOrderId) {
        return this.service.shipSalesOrder(salesOrderId);
    }
    async cancelSalesOrder(salesOrderId) {
        return this.service.cancelSalesOrder(salesOrderId);
    }
    async transferStock(productId, sourceWarehouseId, targetWarehouseId, quantity) {
        return this.service.transferStock(productId, sourceWarehouseId, targetWarehouseId, quantity);
    }
}
